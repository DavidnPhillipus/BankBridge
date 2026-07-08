import { Injectable } from '@nestjs/common';
import type {
  BaseAccount,
  BaseAccountType,
  BaseIdentity,
  BaseTransaction,
} from '../../domain/mock/base-models';
import type {
  AdapterContext,
  TransactionQueryOptions,
} from '../../domain/bank-adapter.port';
import { SeededRandom } from './prng';

const CURRENCY = 'NAD';

/** Expense merchants grouped by seeded Category.name (Namibian-flavoured). */
const MERCHANTS: Record<string, readonly string[]> = {
  Groceries: ['Shoprite', 'Woermann Brock', 'Pick n Pay', 'SPAR', 'Checkers'],
  Restaurants: ["Nando's", 'KFC', 'Ocean Basket', 'Wimpy', 'Debonairs Pizza'],
  Transport: ['Engen', 'Puma Energy', 'Shell', 'Uber Namibia'],
  Utilities: ['NamPower', 'City of Windhoek', 'NamWater'],
  Subscriptions: ['Netflix', 'Spotify', 'DStv', 'MTC', 'Amazon Prime'],
  Healthcare: ['Namibia Medical Care', 'Dis-Chem', 'Clicks Pharmacy'],
  Entertainment: ['Ster-Kinekor', 'Grove Mall Cinema'],
  Other: ['Amazon', 'Takealot', 'Jumia'],
};

const EXPENSE_CATEGORIES = Object.keys(MERCHANTS);

/** Per-category amount ranges (N$). */
const AMOUNT_RANGES: Record<string, [number, number]> = {
  Groceries: [80, 1200],
  Restaurants: [60, 650],
  Transport: [100, 1500],
  Utilities: [300, 2500],
  Subscriptions: [50, 900],
  Healthcare: [100, 3000],
  Entertainment: [80, 500],
  Other: [50, 2000],
};

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Produces deterministic "true" customer data for a given (bank, customer).
 * Adapters consume this and re-express it in their own dialect. Because it is
 * seeded, an account's balance and transactions are stable across requests.
 */
@Injectable()
export class MockDataFactory {
  accounts(adapterKey: string, ctx: AdapterContext): BaseAccount[] {
    const rng = new SeededRandom(`${adapterKey}:${ctx.customerRef}:accounts`);
    const prefix = this.prefixFor(adapterKey);
    const count = rng.int(2, 3);

    const blueprint: Array<{ name: string; type: BaseAccountType }> = [
      { name: 'Main Account', type: 'CHECKING' },
      { name: 'Savings Account', type: 'SAVINGS' },
      { name: 'Credit Card', type: 'CREDIT' },
    ];

    return blueprint.slice(0, count).map((bp, index) => {
      const externalId = `${prefix}-${rng.int(10_000_000, 99_999_999)}-${index}`;
      const mask = String(rng.int(1000, 9999));

      let balance: number;
      if (bp.type === 'SAVINGS') balance = rng.money(5_000, 120_000);
      else if (bp.type === 'CREDIT') balance = -rng.money(500, 15_000);
      else balance = rng.money(1_500, 45_000);

      const available =
        bp.type === 'CREDIT'
          ? rng.money(0, 25_000) // remaining credit limit
          : Math.round(Math.max(0, balance - rng.money(0, 500)) * 100) / 100;

      return {
        externalId,
        name: bp.name,
        type: bp.type,
        mask,
        currency: CURRENCY,
        balance,
        available,
      };
    });
  }

  identity(adapterKey: string, ctx: AdapterContext): BaseIdentity {
    const rng = new SeededRandom(`${adapterKey}:${ctx.customerRef}:identity`);
    const first = rng.pick(['Johannes', 'Selma', 'Petrus', 'Ndapewa', 'Tangeni', 'Maria']);
    const last = rng.pick(['Amupolo', 'Shikongo', 'Nangolo', 'Hamutenya', 'Iithete']);
    return {
      fullName: `${first} ${last}`,
      email: `${first}.${last}@example.na`.toLowerCase(),
      phone: `+264 81 ${rng.int(100, 999)} ${rng.int(1000, 9999)}`,
    };
  }

  transactions(
    adapterKey: string,
    ctx: AdapterContext,
    accountExternalId: string,
    options?: TransactionQueryOptions,
  ): BaseTransaction[] {
    const account = this.accounts(adapterKey, ctx).find(
      (a) => a.externalId === accountExternalId,
    );
    if (!account) return [];

    const rng = new SeededRandom(
      `${adapterKey}:${ctx.customerRef}:txn:${accountExternalId}`,
    );
    const now = Date.now();
    const transactions: BaseTransaction[] = [];
    let seq = 0;

    // Recurring monthly salary into the primary (checking) account.
    if (account.type === 'CHECKING') {
      const salary = rng.money(8_000, 25_000);
      for (let month = 0; month < 3; month++) {
        const bookedAt = new Date(now - month * 30 * DAY_MS - rng.int(0, 3) * DAY_MS);
        transactions.push({
          externalId: `${accountExternalId}-TXN-${seq++}`,
          accountExternalId,
          amount: salary,
          direction: 'CREDIT',
          currency: CURRENCY,
          description: 'Salary Payment',
          merchant: null,
          category: 'Salary',
          bookedAt,
        });
      }
    }

    const expenseCount = rng.int(22, 42);
    for (let i = 0; i < expenseCount; i++) {
      const category = rng.pick(EXPENSE_CATEGORIES);
      const merchant = rng.pick(MERCHANTS[category]);
      const [min, max] = AMOUNT_RANGES[category];
      const bookedAt = new Date(now - rng.int(0, 90) * DAY_MS - rng.int(0, 86_400) * 1000);
      transactions.push({
        externalId: `${accountExternalId}-TXN-${seq++}`,
        accountExternalId,
        amount: rng.money(min, max),
        direction: 'DEBIT',
        currency: CURRENCY,
        description: `${merchant} purchase`,
        merchant,
        category,
        bookedAt,
      });
    }

    let result = transactions.sort(
      (a, b) => b.bookedAt.getTime() - a.bookedAt.getTime(),
    );
    if (options?.since) {
      result = result.filter((t) => t.bookedAt >= options.since!);
    }
    if (options?.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }
    return result;
  }

  /** Short bank code used to make external ids look bank-specific. */
  private prefixFor(adapterKey: string): string {
    return adapterKey
      .split('_')
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }
}
