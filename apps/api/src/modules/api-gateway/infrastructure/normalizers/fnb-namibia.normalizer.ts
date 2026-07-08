import { Injectable } from '@nestjs/common';
import type { AccountType } from '@bankbridge/contracts';
import type {
  FnbRawAccount,
  FnbRawTransaction,
} from '../../../bank-adapters/infrastructure/mock/fnb-namibia.adapter';
import type { BankNormalizer } from '../../domain/bank-normalizer.port';
import type {
  NormalizedAccount,
  NormalizedBalance,
  NormalizedIdentity,
  NormalizedTransaction,
} from '../../domain/normalized-models';
import { money } from './helpers';

const ACCOUNT_TYPE: Record<FnbRawAccount['product_type'], AccountType> = {
  cheque: 'CHECKING',
  savings: 'SAVINGS',
  credit: 'CREDIT',
};

@Injectable()
export class FnbNamibiaNormalizer implements BankNormalizer {
  readonly adapterKey = 'fnb_namibia';

  normalizeAccounts(raw: unknown): NormalizedAccount[] {
    const accounts = (raw as { accounts?: FnbRawAccount[] })?.accounts ?? [];
    return accounts.map((a) => ({
      externalId: a.id,
      name: a.name,
      type: ACCOUNT_TYPE[a.product_type],
      mask: a.last4 ?? null,
      currency: a.ccy,
      balance: money(a.currentBalance),
      available: money(a.availableFunds),
    }));
  }

  normalizeBalance(raw: unknown): NormalizedBalance | null {
    const d = raw as {
      account_id?: string;
      currentBalance?: number;
      availableFunds?: number;
      ccy?: string;
    } | null;
    if (!d?.account_id || d.currentBalance == null || d.availableFunds == null) {
      return null;
    }
    return {
      externalId: d.account_id,
      current: money(d.currentBalance),
      available: money(d.availableFunds),
      currency: d.ccy ?? 'NAD',
    };
  }

  normalizeTransactions(raw: unknown): NormalizedTransaction[] {
    const txns = (raw as { transactions?: FnbRawTransaction[] })?.transactions ?? [];
    return txns.map((t) => ({
      externalId: t.txn_id,
      accountExternalId: t.account_id,
      amount: money(t.amt),
      currency: t.ccy,
      type: t.direction === 'debit' ? 'DEBIT' : 'CREDIT',
      status: 'POSTED',
      description: t.narrative,
      merchantName: t.merchant,
      categoryName: t.cat,
      bookedAt: new Date(t.txn_date),
    }));
  }

  normalizeIdentity(raw: unknown): NormalizedIdentity | null {
    const c = (raw as {
      customer?: { full_name: string; email_address: string; msisdn: string };
    })?.customer;
    return c
      ? { fullName: c.full_name, email: c.email_address, phone: c.msisdn }
      : null;
  }
}
