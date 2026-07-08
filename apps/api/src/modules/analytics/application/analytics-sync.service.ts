import { Inject, Injectable } from '@nestjs/common';
import {
  ACCOUNT_REPOSITORY,
  type AccountRepository,
} from '../../accounts/domain/account-repository.port';
import { SyncAccountsUseCase } from '../../accounts/application/sync-accounts.use-case';
import { ConsentAccessService } from '../../consent/application/consent-access.service';
import { TransactionSyncService } from '../../transactions/application/transaction-sync.service';

/**
 * Ensures the persisted data analytics reads from is present and current:
 * syncs accounts, then transactions for every account whose bank has a
 * TRANSACTIONS_READ consent. Returns the consented bank ids so callers can
 * scope their aggregation queries to exactly what the user authorized.
 */
@Injectable()
export class AnalyticsSyncService {
  constructor(
    private readonly syncAccounts: SyncAccountsUseCase,
    private readonly consentAccess: ConsentAccessService,
    private readonly transactionSync: TransactionSyncService,
    @Inject(ACCOUNT_REPOSITORY) private readonly accounts: AccountRepository,
  ) {}

  async ensure(userId: string, force = false): Promise<string[]> {
    await this.syncAccounts.execute(userId, force);

    const banks = await this.consentAccess.getConsentedBanks(
      userId,
      'TRANSACTIONS_READ',
    );
    const bankIds = banks.map((b) => b.bankId);

    const accounts = await this.accounts.findManyByUser(userId, bankIds);
    await Promise.all(
      accounts.map((a) => this.transactionSync.sync(userId, a.id, force)),
    );

    return bankIds;
  }
}
