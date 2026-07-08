import { z } from 'zod';

/** Severity drives ordering and UI treatment (color/icon). */
export const insightSeveritySchema = z.enum([
  'positive',
  'info',
  'warning',
  'critical',
]);
export type InsightSeverity = z.infer<typeof insightSeveritySchema>;

/** Broad kind of insight, useful for grouping/filtering on the client. */
export const insightTypeSchema = z.enum([
  'SAVINGS',
  'CATEGORY',
  'SUBSCRIPTIONS',
  'MERCHANT',
  'CASHFLOW',
  'GENERAL',
]);
export type InsightType = z.infer<typeof insightTypeSchema>;

export const aiInsightSchema = z.object({
  id: z.string(), // stable slug (deterministic)
  type: insightTypeSchema,
  severity: insightSeveritySchema,
  title: z.string(),
  detail: z.string(),
  recommendation: z.string().nullable(),
  category: z.string().nullable(),
  metric: z
    .object({ label: z.string(), value: z.number() })
    .nullable(),
});
export type AiInsight = z.infer<typeof aiInsightSchema>;

/** Response for GET /ai-insights — a headline plus prioritized insights. */
export const aiInsightsResponseSchema = z.object({
  from: z.string(),
  to: z.string(),
  months: z.number(),
  generatedAt: z.string(),
  provider: z.string(), // e.g. "rule-based" | "llm"
  summary: z.string(),
  insights: z.array(aiInsightSchema),
});
export type AiInsightsResponse = z.infer<typeof aiInsightsResponseSchema>;
