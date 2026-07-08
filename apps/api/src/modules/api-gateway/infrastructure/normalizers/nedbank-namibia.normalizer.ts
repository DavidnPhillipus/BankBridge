import { Injectable } from '@nestjs/common';
import type { AccountType } from '@bankbridge/contracts';
import type {
  NedbankRawAccount,
  NedbankRawTransaction,
} from '../../../bank-adapters/infrastructure/mock/nedbank-namibia.adapter';
import type { BankNormalizer } from '../../domain/bank-normalizer.port';
import type {
  NormalizedAccount,
  NormalizedBalance,
  NormalizedIdentity,
  NormalizedTransaction,
} from '../../domain/normalized-models';
import { last4, money } from './helpers';

const ACCOUNT_TYPE: Record<NedbankRawAccount['acc_type'], AccountType> = {
  CURRENT: 'CHECKING',
  SAVINGS: 'SAVINGS',
  CREDIT: 'CREDIT',
};

@Injectable()
export class NedbankNamibiaNormalizer implements BankNormalizer {
  readonly adapterKey = 'nedbank_namibia';

  normalizeAccounts(raw: unknown): NormalizedAccount[] {
    const results = (raw as { results?: NedbankRawAccount[] })?.results ?? [];
    return results.map((a) => ({
      externalId: a.acc_no,
      name: a.acc_name,
      type: ACCOUNT_TYPE[a.acc_type],
      mask: last4(a.masked),
      currency: a.curr,
      balance: money(a.current_balance),
      available: money(a.avail_balance),
    }));
  }

  normalizeBalance(raw: unknown): NormalizedBalance | null {
    const d = raw as {
      acc_no?: string;
      current_balance?: number;
      avail_balance?: number;
      curr?: string;
    } | null;
    if (!d?.acc_no || d.current_balance == null || d.avail_balance == null) {
      return null;
    }
    return {
      externalId: d.acc_no,
      current: money(d.current_balance),
      available: money(d.avail_balance),
      currency: d.curr ?? 'NAD',
    };
  }

  normalizeTransactions(raw: unknown): NormalizedTransaction[] {
    const results = (raw as { results?: NedbankRawTransaction[] })?.results ?? [];
    return results.map((t) => ({
      externalId: t.ref,
      accountExternalId: t.acc_no,
      amount: money(Math.abs(t.value)),
      currency: t.curr,
      type: t.value < 0 ? 'DEBIT' : 'CREDIT',
      status: 'POSTED',
      description: t.desc,
      merchantName: t.merchant,
      categoryName: t.category,
      bookedAt: new Date(t.posted_at),
    }));
  }

  normalizeIdentity(raw: unknown): NormalizedIdentity | null {
    const p = (raw as { profile?: { name: string; email: string; cell: string } })
      ?.profile;
    return p ? { fullName: p.name, email: p.email, phone: p.cell } : null;
  }
}
