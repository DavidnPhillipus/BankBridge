import type { NormalizedAccount } from '../../api-gateway/domain/normalized-models';
import type { Account } from './account.entity';

export const ACCOUNT_REPOSITORY = Symbol('ACCOUNT_REPOSITORY');

export interface AccountRepository {
  /** Upserts normalized accounts for a user at a bank (keyed by bank+externalId). */
  upsertFromGateway(
    userId: string,
    bankId: string,
    accounts: NormalizedAccount[],
  ): Promise<void>;

  /** All persisted accounts for a user, optionally restricted to given banks. */
  findManyByUser(userId: string, bankIds?: string[]): Promise<Account[]>;

  findByIdForUser(userId: string, accountId: string): Promise<Account | null>;

  updateBalance(
    accountId: string,
    balance: number,
    availableBalance: number,
  ): Promise<Account>;
}
