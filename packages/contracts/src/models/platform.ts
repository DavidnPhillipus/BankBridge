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
