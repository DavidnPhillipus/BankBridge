import type { AiInsight, AnalyticsOverview } from '@bankbridge/contracts';

/** DI token for the pluggable insight provider (rule-based today, LLM later). */
export const INSIGHT_PROVIDER = Symbol('INSIGHT_PROVIDER');

/** Everything a provider needs to reason about a user's finances. */
export interface InsightContext {
  displayName: string;
  overview: AnalyticsOverview;
}

/**
 * Strategy for turning analytics into human-readable financial insights.
 *
 * This mirrors the bank adapter pattern: callers depend only on this interface,
 * so a deterministic rule-based generator ships now and an LLM-backed provider
 * can replace it later with zero changes upstream.
 */
export interface InsightProvider {
  /** Short identifier surfaced in the response (e.g. "rule-based"). */
  readonly name: string;

  generate(ctx: InsightContext): Promise<AiInsight[]>;
}
