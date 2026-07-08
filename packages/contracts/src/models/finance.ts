import { z } from 'zod';
import {
  accountTypeSchema,
  categoryTypeSchema,
  transactionStatusSchema,
  transactionTypeSchema,
} from '../common/enums';

/** A supported financial institution. */
export const bankSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  logoUrl: z.string().nullable(),
  primaryColor: z.string().nullable(),
  country: z.string(),
  isActive: z.boolean(),
});
export type Bank = z.infer<typeof bankSchema>;

/** Normalized account — the platform's single shape regardless of bank. */
export const accountSchema = z.object({
  id: z.string().uuid(),
  bankId: z.string().uuid(),
  bankName: z.string(),
  name: z.string(),
  accountType: accountTypeSchema,
  mask: z.string().nullable(),
  currency: z.string(),
  balance: z.number(),
  availableBalance: z.number(),
});
export type Account = z.infer<typeof accountSchema>;

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: categoryTypeSchema,
  icon: z.string().nullable(),
  color: z.string().nullable(),
});
export type Category = z.infer<typeof categorySchema>;

export const merchantSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  logoUrl: z.string().nullable(),
});
export type Merchant = z.infer<typeof merchantSchema>;

/** Normalized transaction. Amount is signed by `type` at the source. */
export const transactionSchema = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  amount: z.number(),
  currency: z.string(),
  type: transactionTypeSchema,
  status: transactionStatusSchema,
  description: z.string(),
  merchant: merchantSchema.nullable(),
  category: categorySchema.nullable(),
  bookedAt: z.string(), // ISO 8601
});
export type Transaction = z.infer<typeof transactionSchema>;
