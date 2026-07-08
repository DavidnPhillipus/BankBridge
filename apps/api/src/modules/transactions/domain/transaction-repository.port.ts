import type { NormalizedTransaction } from '../../api-gateway/domain/normalized-models';
import type { Transaction } from './transaction.entity';

export const TRANSACTION_REPOSITORY = Symbol('TRANSACTION_REPOSITORY');

export interface TransactionPageQuery {
  page: number;
  pageSize: number;
  since?: Date;
}

export interface TransactionPageResult {
  data: Transaction[];
  total: number;
}

export interface TransactionRepository {
  /**
   * Upserts normalized transactions for an account, resolving merchant + category
   * names to their platform ids (creating merchants on first sight). Returns the
   * number of transactions written. Keyed by (accountId, externalId).
   */
  upsertMany(
    accountId: string,
    transactions: NormalizedTransaction[],
  ): Promise<number>;

  findPageByAccount(
    accountId: string,
    query: TransactionPageQuery,
  ): Promise<TransactionPageResult>;
}
