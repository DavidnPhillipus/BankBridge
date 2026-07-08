import { Inject, Injectable } from '@nestjs/common';
import type { AnalyticsOverview } from '@bankbridge/contracts';
import {
  ANALYTICS_REPOSITORY,
  type AnalyticsRepository,
} from '../domain/analytics-repository.port';
import {
  AnalyticsCalculator,
  periodKey,
  startOfMonthUtc,
} from '../domain/analytics-calculator';
import { AnalyticsSyncService } from './analytics-sync.service';

export interface OverviewInput {
  months: number;
  force?: boolean;
}

@Injectable()
export class GetOverviewUseCase {
  private readonly calculator = new AnalyticsCalculator();

  constructor(
    private readonly analyticsSync: AnalyticsSyncService,
    @Inject(ANALYTICS_REPOSITORY) private readonly analytics: AnalyticsRepository,
  ) {}

  async execute(userId: string, input: OverviewInput): Promise<AnalyticsOverview> {
    const bankIds = await this.analyticsSync.ensure(userId, input.force ?? false);

    const now = new Date();
    const to = now;
    const from = startOfMonthUtc(now, input.months - 1);

    // Seed every month in the window so the trend has no gaps (ascending).
    const periods: string[] = [];
    for (let i = input.months - 1; i >= 0; i--) {
      periods.push(periodKey(startOfMonthUtc(now, i)));
    }

    const txns = await this.analytics.findTransactions(userId, bankIds, from, to);
    return this.calculator.overview(txns, from, to, periods);
  }
}
