import { z } from 'zod';

export const accountTypeSchema = z.enum([
  'CHECKING',
  'SAVINGS',
  'CREDIT',
  'LOAN',
  'INVESTMENT',
]);
export type AccountType = z.infer<typeof accountTypeSchema>;

export const transactionTypeSchema = z.enum(['DEBIT', 'CREDIT']);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const transactionStatusSchema = z.enum(['PENDING', 'POSTED']);
export type TransactionStatus = z.infer<typeof transactionStatusSchema>;

export const categoryTypeSchema = z.enum(['INCOME', 'EXPENSE', 'TRANSFER']);
export type CategoryType = z.infer<typeof categoryTypeSchema>;

export const consentStatusSchema = z.enum([
  'PENDING',
  'ACTIVE',
  'REVOKED',
  'EXPIRED',
]);
export type ConsentStatus = z.infer<typeof consentStatusSchema>;

export const consentScopeSchema = z.enum([
  'ACCOUNTS_READ',
  'BALANCES_READ',
  'TRANSACTIONS_READ',
  'IDENTITY_READ',
]);
export type ConsentScope = z.infer<typeof consentScopeSchema>;

export const appEnvironmentSchema = z.enum(['SANDBOX', 'PRODUCTION']);
export type AppEnvironment = z.infer<typeof appEnvironmentSchema>;

export const notificationTypeSchema = z.enum([
  'INFO',
  'LOW_BALANCE',
  'FRAUD_ALERT',
  'CONSENT',
  'INSIGHT',
]);
export type NotificationType = z.infer<typeof notificationTypeSchema>;

export const CURRENCY_NAD = 'NAD' as const;
