import { Inject, Injectable } from '@nestjs/common';
import type { AiInsightsResponse } from '@bankbridge/contracts';
import { GetOverviewUseCase } from '../../analytics/application/get-overview.use-case';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../users/domain/user-repository.port';
import {
  INSIGHT_PROVIDER,
  type InsightProvider,
} from '../domain/insight-provider.port';

export interface GenerateInsightsInput {
  months: number;
  force?: boolean;
}

const money = (value: number): string =>
  `N$${Math.round(value).toLocaleString('en-US')}`;

@Injectable()
export class GenerateInsightsUseCase {
  constructor(
    private readonly getOverview: GetOverviewUseCase,
    @Inject(INSIGHT_PROVIDER) private readonly provider: InsightProvider,
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(
    userId: string,
    input: GenerateInsightsInput,
  ): Promise<AiInsightsResponse> {
    const overview = await this.getOverview.execute(userId, {
      months: input.months,
      force: input.force,
    });

    const user = await this.users.findById(userId);
    const displayName = user?.firstName ?? 'there';

    const insights = await this.provider.generate({ displayName, overview });

    return {
      from: overview.from,
      to: overview.to,
      months: overview.months,
      generatedAt: new Date().toISOString(),
      provider: this.provider.name,
      summary: this.buildSummary(displayName, overview),
      insights,
    };
  }

  private buildSummary(
    name: string,
    o: {
      months: number;
      totalIncome: number;
      totalExpense: number;
      net: number;
      savingsRate: number;
    },
  ): string {
    const window = o.months === 1 ? 'the last month' : `the last ${o.months} months`;
    if (o.totalIncome <= 0 && o.totalExpense <= 0) {
      return `Hi ${name} — there is no activity to analyze over ${window} yet.`;
    }
    if (o.net < 0) {
      return `Hi ${name} — over ${window} you earned ${money(
        o.totalIncome,
      )} and spent ${money(o.totalExpense)}, running a shortfall of ${money(
        Math.abs(o.net),
      )}.`;
    }
    return `Hi ${name} — over ${window} you earned ${money(
      o.totalIncome,
    )}, spent ${money(o.totalExpense)}, and saved ${money(o.net)} (${o.savingsRate}%).`;
  }
}
