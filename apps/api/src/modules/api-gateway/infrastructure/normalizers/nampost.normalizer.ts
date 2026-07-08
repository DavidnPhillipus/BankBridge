import { Injectable } from '@nestjs/common';
import type { AccountType } from '@bankbridge/contracts';
import type {
  NampostRawAccount,
  NampostRawMovement,
} from '../../../bank-adapters/infrastructure/mock/nampost.adapter';
import type { BankNormalizer } from '../../domain/bank-normalizer.port';
import type {
  NormalizedAccount,
  NormalizedBalance,
  NormalizedIdentity,
  NormalizedTransaction,
} from '../../domain/normalized-models';
import { money } from './helpers';

const ACCOUNT_TYPE: Record<NampostRawAccount['kind'], AccountType> = {
  current: 'CHECKING',
  savings: 'SAVINGS',
  credit: 'CREDIT',
};

// NamPost speaks in integer cents; divide by 100 to reach canonical currency units.
const fromCents = (cents: number): number => money(cents / 100);

@Injectable()
export class NampostNormalizer implements BankNormalizer {
  readonly adapterKey = 'nampost';

  normalizeAccounts(raw: unknown): NormalizedAccount[] {
    const accounts =
      (raw as { data?: { accounts?: NampostRawAccount[] } })?.data?.accounts ?? [];
    return accounts.map((a) => ({
      externalId: a.ref,
      name: a.label,
      type: ACCOUNT_TYPE[a.kind],
      mask: a.tail ?? null,
      currency: a.currency,
      balance: fromCents(a.balance_cents),
      available: fromCents(a.available_cents),
    }));
  }

  normalizeBalance(raw: unknown): NormalizedBalance | null {
    const d = (raw as {
      data?: {
        ref: string;
        balance_cents: number;
        available_cents: number;
        currency: string;
      } | null;
    })?.data;
    if (!d) return null;
    return {
      externalId: d.ref,
      current: fromCents(d.balance_cents),
      available: fromCents(d.available_cents),
      currency: d.currency,
    };
  }

  normalizeTransactions(raw: unknown): NormalizedTransaction[] {
    const movements =
      (raw as { data?: { movements?: NampostRawMovement[] } })?.data?.movements ?? [];
    return movements.map((m) => ({
      externalId: m.id,
      accountExternalId: m.ref,
      amount: fromCents(Math.abs(m.amount_cents)),
      currency: m.currency,
      type: m.amount_cents < 0 ? 'DEBIT' : 'CREDIT',
      status: 'POSTED',
      description: m.note,
      merchantName: m.merchant,
      categoryName: m.group,
      bookedAt: new Date(m.timestamp),
    }));
  }

  normalizeIdentity(raw: unknown): NormalizedIdentity | null {
    const m = (raw as { member?: { name: string; email: string; phone: string } })
      ?.member;
    return m ? { fullName: m.name, email: m.email, phone: m.phone } : null;
  }
}
