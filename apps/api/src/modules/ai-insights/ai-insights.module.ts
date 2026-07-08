import { Module } from '@nestjs/common';
import { AnalyticsModule } from '../analytics/analytics.module';
import { UsersModule } from '../users/users.module';
import { GenerateInsightsUseCase } from './application/generate-insights.use-case';
import { INSIGHT_PROVIDER } from './domain/insight-provider.port';
import { RuleBasedInsightProvider } from './infrastructure/rule-based-insight.provider';
import { AiInsightsController } from './interface/ai-insights.controller';

/**
 * AI Insights: turns the analytics overview into prioritized, human-readable
 * financial advice. The InsightProvider port keeps generation pluggable — a
 * deterministic rule-based provider ships now; an LLM provider can replace it
 * behind the same interface with no changes to callers.
 */
@Module({
  imports: [AnalyticsModule, UsersModule],
  controllers: [AiInsightsController],
  providers: [
    GenerateInsightsUseCase,
    { provide: INSIGHT_PROVIDER, useClass: RuleBasedInsightProvider },
  ],
  exports: [INSIGHT_PROVIDER],
})
export class AiInsightsModule {}
