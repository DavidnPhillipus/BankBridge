import { z } from 'zod';
import { notificationTypeSchema } from '../common/enums';

export const notificationSchema = z.object({
  id: z.string().uuid(),
  type: notificationTypeSchema,
  title: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  createdAt: z.string(),
});
export type Notification = z.infer<typeof notificationSchema>;

export const auditLogSchema = z.object({
  id: z.string().uuid(),
  actorId: z.string().uuid().nullable(),
  action: z.string(),
  resourceType: z.string(),
  resourceId: z.string().nullable(),
  ip: z.string().nullable(),
  metadata: z.record(z.unknown()).nullable(),
  createdAt: z.string(),
});
export type AuditLog = z.infer<typeof auditLogSchema>;

export const analyticsSnapshotSchema = z.object({
  id: z.string().uuid(),
  period: z.string(), // YYYY-MM
  totalIncome: z.number(),
  totalExpense: z.number(),
  net: z.number(),
  byCategory: z.record(z.number()).nullable(),
});
export type AnalyticsSnapshot = z.infer<typeof analyticsSnapshotSchema>;

/** Spend aggregated for one category over the analysis window. */
export const categorySpendSchema = z.object({
  category: z.string(),
  amount: z.number(),
  percentage: z.number(), // share of total expense (0-100)
});
export type CategorySpend = z.infer<typeof categorySpendSchema>;

/** Spend aggregated for one merchant over the analysis window. */
export const merchantSpendSchema = z.object({
  merchant: z.string(),
  amount: z.number(),
  count: z.number(),
});
export type MerchantSpend = z.infer<typeof merchantSpendSchema>;

/** Income/expense/net for a single month (trend point). */
export const monthlyPointSchema = z.object({
  period: z.string(), // YYYY-MM
  totalIncome: z.number(),
  totalExpense: z.number(),
  net: z.number(),
});
export type MonthlyPoint = z.infer<typeof monthlyPointSchema>;

/** Dashboard analytics over a rolling window (GET /analytics/overview). */
export const analyticsOverviewSchema = z.object({
  from: z.string(), // ISO date
  to: z.string(), // ISO date
  months: z.number(),
  totalIncome: z.number(),
  totalExpense: z.number(),
  net: z.number(),
  savingsRate: z.number(), // 0-100
  transactionCount: z.number(),
  byCategory: z.array(categorySpendSchema),
  topMerchants: z.array(merchantSpendSchema),
  monthlyTrend: z.array(monthlyPointSchema),
});
export type AnalyticsOverview = z.infer<typeof analyticsOverviewSchema>;

/** Generic paginated envelope reused across list endpoints. */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const paginationMetaSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

/** Paginated notifications envelope. */
export const notificationPageSchema = z.object({
  data: z.array(notificationSchema),
  meta: paginationMetaSchema,
});
export type NotificationPage = z.infer<typeof notificationPageSchema>;

export const unreadCountSchema = z.object({
  count: z.number().int().nonnegative(),
});
export type UnreadCount = z.infer<typeof unreadCountSchema>;
