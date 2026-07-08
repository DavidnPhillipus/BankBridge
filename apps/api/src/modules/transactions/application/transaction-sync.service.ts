import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GatewayService } from '../../api-gateway/application/gateway.service';
import { ConsentAccessService } from '../../consent/application/consent-access.service';
import {
  ACCOUNT_REPOSITORY,
  type AccountRepository,
} from '../../accounts/domain/account-repository.port';
import {
  TRANSACTION_REPOSITORY,
  type TransactionRepository,
} from '../domain/transaction-repository.port';

/**
 * Pulls an account's transactions through the API Gateway (normalized), gated by
 * a TRANSACTIONS_READ consent for that account's bank, and persists them with
 * merchant + category resolution. Reused by the list endpoint (read-through) and
 * the explicit sync endpoint, and available to analytics.
 */
@Injectable()
export class TransactionSyncService {
  constructor(
    private readonly consentAccess: ConsentAccessService,
    private readonly gateway: GatewayService,
    @Inject(ACCOUNT_REPOSITORY) private readonly accounts: AccountRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactions: TransactionRepository,
  ) {}

  async sync(userId: string, accountId: string, force = false): Promise<number> {
    const account = await this.accounts.findByIdForUser(userId, accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const bank = await this.consentAccess.assertBankScope(
      userId,
      account.bankId,
      'TRANSACTIONS_READ',
    );

    const ctx = { customerRef: userId };
    if (force) await this.gateway.invalidate(bank.adapterKey, ctx);

    const normalized = await this.gateway.getTransactions(
      bank.adapterKey,
      ctx,
      account.externalId,
    );
    return this.transactions.upsertMany(accountId, normalized);
  }
}
