import { Module } from '@nestjs/common';

/**
 * AI Insights: rule-based financial insight engine behind an InsightProvider
 * port so an LLM can be swapped in later without changing consumers.
 */
@Module({})
export class AiInsightsModule {}
