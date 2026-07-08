import type { AnalyticsSnapshot } from '@bankbridge/contracts';
import type { AnalyticsTxn, MonthlyAggregate } from './analytics.types';

export const ANALYTICS_REPOSITORY = Symbol('ANALYTICS_REPOSITORY');

export interface AnalyticsRepository {
  /**
   * Flat projection of a user's persisted transactions for analysis, limited to
   * the given banks (those with TRANSACTIONS_READ consent) and date window.
   */
  findTransactions(
    userId: string,
    bankIds: string[],
    from: Date,
    to: Date,
  ): Promise<AnalyticsTxn[]>;

  /** Upserts a monthly snapshot (unique per user+period). */
  upsertSnapshot(userId: string, aggregate: MonthlyAggregate): Promise<AnalyticsSnapshot>;

  /** Recent snapshots for a user, newest first. */
  findSnapshots(userId: string, limit: number): Promise<AnalyticsSnapshot[]>;
}
