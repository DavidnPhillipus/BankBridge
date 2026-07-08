import { Inject, Injectable } from '@nestjs/common';
import type { AnalyticsSnapshot } from '@bankbridge/contracts';
import {
  ANALYTICS_REPOSITORY,
  type AnalyticsRepository,
} from '../domain/analytics-repository.port';
import { AnalyticsCalculator, startOfMonthUtc } from '../domain/analytics-calculator';
import { AnalyticsSyncService } from './analytics-sync.service';

export interface RecomputeInput {
  months: number;
  force?: boolean;
}

/**
 * Recomputes and persists monthly AnalyticsSnapshot rows over a rolling window.
 * Used by GET /analytics/snapshots (force=false) and POST /analytics/recompute
 * (force=true). Snapshots keep the dashboard fast while staying recomputable.
 */
@Injectable()
export class RecomputeSnapshotsUseCase {
  private readonly calculator = new AnalyticsCalculator();

  constructor(
    private readonly analyticsSync: AnalyticsSyncService,
    @Inject(ANALYTICS_REPOSITORY) private readonly analytics: AnalyticsRepository,
  ) {}

  async execute(userId: string, input: RecomputeInput): Promise<AnalyticsSnapshot[]> {
    const bankIds = await this.analyticsSync.ensure(userId, input.force ?? false);

    const now = new Date();
    const from = startOfMonthUtc(now, input.months - 1);
    const txns = await this.analytics.findTransactions(userId, bankIds, from, now);

    const aggregates = this.calculator.monthlyAggregates(txns);
    await Promise.all(
      aggregates.map((a) => this.analytics.upsertSnapshot(userId, a)),
    );

    return this.analytics.findSnapshots(userId, input.months);
  }
}
