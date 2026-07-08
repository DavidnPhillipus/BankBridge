import type { TransactionType } from '@bankbridge/contracts';

/** Minimal transaction projection used for analytics aggregation. */
export interface AnalyticsTxn {
  amount: number; // always positive
  type: TransactionType; // CREDIT = income, DEBIT = expense
  categoryName: string | null;
  merchantName: string | null;
  bookedAt: Date;
}

/** Computed figures for one month, ready to persist as an AnalyticsSnapshot. */
export interface MonthlyAggregate {
  period: string; // YYYY-MM
  totalIncome: number;
  totalExpense: number;
  net: number;
  byCategory: Record<string, number>; // expense by category name
}
