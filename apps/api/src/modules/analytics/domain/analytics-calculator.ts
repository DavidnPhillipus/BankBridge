import type {
  AnalyticsOverview,
  CategorySpend,
  MerchantSpend,
  MonthlyPoint,
} from '@bankbridge/contracts';
import type { AnalyticsTxn, MonthlyAggregate } from './analytics.types';

const round2 = (n: number): number => Math.round(n * 100) / 100;

/** UTC year-month key (YYYY-MM) for a date. */
export function periodKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

/** The first day (UTC) of the month `monthsBack` before `ref`. */
export function startOfMonthUtc(ref: Date, monthsBack = 0): Date {
  return new Date(
    Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() - monthsBack, 1, 0, 0, 0, 0),
  );
}

const isIncome = (t: AnalyticsTxn): boolean => t.type === 'CREDIT';

/**
 * Pure analytics logic — no I/O. Aggregates a flat list of transactions into
 * monthly snapshots and a rolling-window overview (category + merchant
 * breakdowns and a per-month trend). Kept side-effect free so it is trivially
 * testable and reusable by the AI Insights module.
 */
export class AnalyticsCalculator {
  /** One aggregate per distinct month present in the data (unsorted). */
  monthlyAggregates(txns: AnalyticsTxn[]): MonthlyAggregate[] {
    const byPeriod = new Map<string, MonthlyAggregate>();

    for (const t of txns) {
      const period = periodKey(t.bookedAt);
      const agg =
        byPeriod.get(period) ??
        ({ period, totalIncome: 0, totalExpense: 0, net: 0, byCategory: {} } as MonthlyAggregate);

      if (isIncome(t)) {
        agg.totalIncome += t.amount;
      } else {
        agg.totalExpense += t.amount;
        const key = t.categoryName ?? 'Uncategorized';
        agg.byCategory[key] = (agg.byCategory[key] ?? 0) + t.amount;
      }
      byPeriod.set(period, agg);
    }

    return [...byPeriod.values()].map((a) => ({
      period: a.period,
      totalIncome: round2(a.totalIncome),
      totalExpense: round2(a.totalExpense),
      net: round2(a.totalIncome - a.totalExpense),
      byCategory: Object.fromEntries(
        Object.entries(a.byCategory).map(([k, v]) => [k, round2(v)]),
      ),
    }));
  }

  /**
   * Rolling-window overview covering [from, to]. `periods` seeds the trend so
   * months with no activity still appear (as zeros).
   */
  overview(
    txns: AnalyticsTxn[],
    from: Date,
    to: Date,
    periods: string[],
    topMerchantLimit = 5,
  ): AnalyticsOverview {
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals = new Map<string, number>();
    const merchantTotals = new Map<string, { amount: number; count: number }>();

    for (const t of txns) {
      if (isIncome(t)) {
        totalIncome += t.amount;
        continue;
      }
      totalExpense += t.amount;

      const cat = t.categoryName ?? 'Uncategorized';
      categoryTotals.set(cat, (categoryTotals.get(cat) ?? 0) + t.amount);

      if (t.merchantName) {
        const m = merchantTotals.get(t.merchantName) ?? { amount: 0, count: 0 };
        m.amount += t.amount;
        m.count += 1;
        merchantTotals.set(t.merchantName, m);
      }
    }

    const byCategory: CategorySpend[] = [...categoryTotals.entries()]
      .map(([category, amount]) => ({
        category,
        amount: round2(amount),
        percentage: totalExpense > 0 ? round2((amount / totalExpense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const topMerchants: MerchantSpend[] = [...merchantTotals.entries()]
      .map(([merchant, { amount, count }]) => ({
        merchant,
        amount: round2(amount),
        count,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, topMerchantLimit);

    const aggByPeriod = new Map(
      this.monthlyAggregates(txns).map((a) => [a.period, a]),
    );
    const monthlyTrend: MonthlyPoint[] = periods.map((period) => {
      const a = aggByPeriod.get(period);
      return {
        period,
        totalIncome: a?.totalIncome ?? 0,
        totalExpense: a?.totalExpense ?? 0,
        net: a?.net ?? 0,
      };
    });

    const net = round2(totalIncome - totalExpense);
    const savingsRate = totalIncome > 0 ? round2((net / totalIncome) * 100) : 0;

    return {
      from: from.toISOString(),
      to: to.toISOString(),
      months: periods.length,
      totalIncome: round2(totalIncome),
      totalExpense: round2(totalExpense),
      net,
      savingsRate,
      transactionCount: txns.length,
      byCategory,
      topMerchants,
      monthlyTrend,
    };
  }
}
