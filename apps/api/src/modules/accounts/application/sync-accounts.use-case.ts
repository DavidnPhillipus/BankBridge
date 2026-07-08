import { Inject, Injectable } from '@nestjs/common';
import type { Account as AccountDto } from '@bankbridge/contracts';
import { GatewayService } from '../../api-gateway/application/gateway.service';
import { ConsentAccessService } from '../../consent/application/consent-access.service';
import {
  ACCOUNT_REPOSITORY,
  type AccountRepository,
} from '../domain/account-repository.port';

/**
 * Pulls accounts from every bank the user has ACCOUNTS_READ consent for, through
 * the API Gateway (which normalizes each bank's dialect), and persists them.
 *
 * This is the single read-through path: GET /accounts calls it (force=false, so
 * the gateway's short-lived cache is honored) and POST /accounts/sync calls it
 * (force=true, busting the cache for a live refresh). Accounts at banks whose
 * consent is no longer effective are never returned.
 */
@Injectable()
export class SyncAccountsUseCase {
  constructor(
    private readonly consentAccess: ConsentAccessService,
    private readonly gateway: GatewayService,
    @Inject(ACCOUNT_REPOSITORY) private readonly accounts: AccountRepository,
  ) {}

  async execute(userId: string, force = false): Promise<AccountDto[]> {
    const banks = await this.consentAccess.getConsentedBanks(userId, 'ACCOUNTS_READ');
    const ctx = { customerRef: userId };

    await Promise.all(
      banks.map(async (bank) => {
        if (force) await this.gateway.invalidate(bank.adapterKey, ctx);
        const normalized = await this.gateway.getAccounts(bank.adapterKey, ctx);
        await this.accounts.upsertFromGateway(userId, bank.bankId, normalized);
      }),
    );

    const bankIds = banks.map((b) => b.bankId);
    const persisted = await this.accounts.findManyByUser(userId, bankIds);
    return persisted.map((a) => a.toDto());
  }
}
