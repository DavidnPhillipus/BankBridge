import { Injectable } from '@nestjs/common';
import type { AiInsight, AnalyticsOverview, MonthlyPoint } from '@bankbridge/contracts';
import type {
  InsightContext,
  InsightProvider,
} from '../domain/insight-provider.port';

const money = (value: number): string =>
  `N$${Math.round(value).toLocaleString('en-US')}`;

/**
 * Deterministic, explainable insight generator. Encodes personal-finance
 * heuristics over the analytics overview. Being pure + deterministic makes it
 * predictable and testable; an LLM provider can later implement the same port.
 */
@Injectable()
export class RuleBasedInsightProvider implements InsightProvider {
  readonly name = 'rule-based';

  async generate(ctx: InsightContext): Promise<AiInsight[]> {
    const { overview } = ctx;
    const insights: AiInsight[] = [];

    this.savingsRateInsight(overview, insights);
    this.topCategoryInsight(overview, insights);
    this.subscriptionsInsight(overview, insights);
    this.topMerchantInsight(overview, insights);
    this.cashflowTrendInsight(overview, insights);

    if (insights.length === 0) {
      insights.push({
        id: 'general-no-data',
        type: 'GENERAL',
        severity: 'info',
        title: 'Not enough activity yet',
        detail:
          'There is little transaction history in this window, so insights are limited.',
        recommendation: 'Link more accounts or widen the time range for a fuller picture.',
        category: null,
        metric: null,
      });
    }

    return this.sortBySeverity(insights);
  }

  private savingsRateInsight(o: AnalyticsOverview, out: AiInsight[]): void {
    if (o.totalIncome <= 0) return;
    const rate = o.savingsRate;
    const metric = { label: 'Savings rate', value: rate };

    if (o.net < 0) {
      out.push({
        id: 'savings-negative',
        type: 'SAVINGS',
        severity: 'critical',
        title: 'You are spending more than you earn',
        detail: `Over this period you spent ${money(o.totalExpense)} against ${money(
          o.totalIncome,
        )} of income — a shortfall of ${money(Math.abs(o.net))}.`,
        recommendation:
          'Trim your largest expense categories to bring spending back below income.',
        category: null,
        metric,
      });
    } else if (rate < 10) {
      out.push({
        id: 'savings-low',
        type: 'SAVINGS',
        severity: 'warning',
        title: 'Your savings rate is low',
        detail: `You are keeping about ${rate}% of your income (${money(o.net)}).`,
        recommendation: 'Aim for 15–20%. Automating a monthly transfer to savings helps.',
        category: null,
        metric,
      });
    } else if (rate >= 20) {
      out.push({
        id: 'savings-healthy',
        type: 'SAVINGS',
        severity: 'positive',
        title: 'Strong savings habit',
        detail: `You saved ${money(o.net)} — about ${rate}% of your income. Well done.`,
        recommendation: 'Consider putting surplus into an interest-bearing or investment account.',
        category: null,
        metric,
      });
    } else {
      out.push({
        id: 'savings-steady',
        type: 'SAVINGS',
        severity: 'info',
        title: 'Steady savings',
        detail: `You saved ${money(o.net)} (${rate}% of income) this period.`,
        recommendation: 'A small increase would push you into the healthy 20%+ range.',
        category: null,
        metric,
      });
    }
  }

  private topCategoryInsight(o: AnalyticsOverview, out: AiInsight[]): void {
    const top = o.byCategory[0];
    if (!top || top.percentage < 20) return;

    const severity = top.percentage >= 30 ? 'warning' : 'info';
    out.push({
      id: `category-${top.category.toLowerCase()}`,
      type: 'CATEGORY',
      severity,
      title: `${top.category} dominates your spending`,
      detail: `${top.category} is ${top.percentage}% of your expenses (${money(
        top.amount,
      )}).`,
      recommendation:
        severity === 'warning'
          ? `Set a monthly budget for ${top.category} and track it closely.`
          : `Keep an eye on ${top.category} so it doesn't creep up.`,
      category: top.category,
      metric: { label: `${top.category} share`, value: top.percentage },
    });
  }

  private subscriptionsInsight(o: AnalyticsOverview, out: AiInsight[]): void {
    const subs = o.byCategory.find((c) => c.category === 'Subscriptions');
    if (!subs || subs.amount <= 0) return;

    const perMonth = o.months > 0 ? subs.amount / o.months : subs.amount;
    out.push({
      id: 'subscriptions-review',
      type: 'SUBSCRIPTIONS',
      severity: perMonth >= 800 ? 'warning' : 'info',
      title: 'Recurring subscriptions add up',
      detail: `You spend about ${money(perMonth)} per month on subscriptions (${money(
        subs.amount,
      )} total).`,
      recommendation: 'Review and cancel any subscriptions you no longer use.',
      category: 'Subscriptions',
      metric: { label: 'Subscriptions / month', value: Math.round(perMonth * 100) / 100 },
    });
  }

  private topMerchantInsight(o: AnalyticsOverview, out: AiInsight[]): void {
    const top = o.topMerchants[0];
    if (!top || o.totalExpense <= 0) return;
    const share = Math.round((top.amount / o.totalExpense) * 1000) / 10;
    if (share < 10) return;

    out.push({
      id: `merchant-${top.merchant.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'MERCHANT',
      severity: 'info',
      title: `${top.merchant} is your top merchant`,
      detail: `You spent ${money(top.amount)} across ${top.count} transactions at ${
        top.merchant
      } — ${share}% of total spending.`,
      recommendation: 'Check whether loyalty programs or bulk buying could reduce this cost.',
      category: null,
      metric: { label: `${top.merchant} spend`, value: top.amount },
    });
  }

  private cashflowTrendInsight(o: AnalyticsOverview, out: AiInsight[]): void {
    const active = o.monthlyTrend.filter(
      (m) => m.totalIncome > 0 || m.totalExpense > 0,
    );
    if (active.length < 2) return;

    const prev: MonthlyPoint = active[active.length - 2];
    const curr: MonthlyPoint = active[active.length - 1];
    if (prev.totalExpense <= 0) return;

    const change = ((curr.totalExpense - prev.totalExpense) / prev.totalExpense) * 100;
    const rounded = Math.round(change * 10) / 10;

    if (rounded >= 20) {
      out.push({
        id: 'cashflow-rising',
        type: 'CASHFLOW',
        severity: 'warning',
        title: 'Your spending is trending up',
        detail: `Expenses rose ${rounded}% from ${prev.period} (${money(
          prev.totalExpense,
        )}) to ${curr.period} (${money(curr.totalExpense)}).`,
        recommendation: 'Review recent purchases to catch any avoidable increases.',
        category: null,
        metric: { label: 'MoM expense change', value: rounded },
      });
    } else if (rounded <= -10) {
      out.push({
        id: 'cashflow-improving',
        type: 'CASHFLOW',
        severity: 'positive',
        title: 'You cut spending recently',
        detail: `Expenses fell ${Math.abs(rounded)}% from ${prev.period} to ${
          curr.period
        }. Nice work.`,
        recommendation: 'Redirect what you saved into your savings or investments.',
        category: null,
        metric: { label: 'MoM expense change', value: rounded },
      });
    }
  }

  private sortBySeverity(insights: AiInsight[]): AiInsight[] {
    const rank: Record<AiInsight['severity'], number> = {
      critical: 0,
      warning: 1,
      info: 2,
      positive: 3,
    };
    return [...insights].sort((a, b) => rank[a.severity] - rank[b.severity]);
  }
}
