import { Injectable } from '@nestjs/common';
import type { AccountType } from '@bankbridge/contracts';
import type {
  WindhoekRawAccount,
  WindhoekRawTransaction,
} from '../../../bank-adapters/infrastructure/mock/bank-windhoek.adapter';
import type { BankNormalizer } from '../../domain/bank-normalizer.port';
import type {
  NormalizedAccount,
  NormalizedBalance,
  NormalizedIdentity,
  NormalizedTransaction,
} from '../../domain/normalized-models';
import { last4, money } from './helpers';

const ACCOUNT_TYPE: Record<WindhoekRawAccount['accountType'], AccountType> = {
  CURRENT: 'CHECKING',
  SAVINGS: 'SAVINGS',
  CREDIT_CARD: 'CREDIT',
};

@Injectable()
export class BankWindhoekNormalizer implements BankNormalizer {
  readonly adapterKey = 'bank_windhoek';

  normalizeAccounts(raw: unknown): NormalizedAccount[] {
    const accounts =
      (raw as { data?: { accounts?: WindhoekRawAccount[] } })?.data?.accounts ?? [];
    return accounts.map((a) => ({
      externalId: a.accountId,
      name: a.nickname,
      type: ACCOUNT_TYPE[a.accountType],
      mask: last4(a.maskedNumber),
      currency: a.currency,
      balance: money(a.balance),
      available: money(a.availableBalance),
    }));
  }

  normalizeBalance(raw: unknown): NormalizedBalance | null {
    const d = (raw as { data?: WindhoekRawAccount | null })?.data;
    if (!d) return null;
    return {
      externalId: d.accountId,
      current: money(d.balance),
      available: money(d.availableBalance),
      currency: d.currency,
    };
  }

  normalizeTransactions(raw: unknown): NormalizedTransaction[] {
    const txns =
      (raw as { data?: { transactions?: WindhoekRawTransaction[] } })?.data
        ?.transactions ?? [];
    return txns.map((t) => ({
      externalId: t.transactionId,
      accountExternalId: t.accountId,
      amount: money(Math.abs(t.amount)),
      currency: t.currency,
      type: t.amount < 0 ? 'DEBIT' : 'CREDIT',
      status: 'POSTED',
      description: t.description,
      merchantName: t.merchantName,
      categoryName: t.category,
      bookedAt: new Date(t.date),
    }));
  }

  normalizeIdentity(raw: unknown): NormalizedIdentity | null {
    const d = (raw as { data?: { name: string; email: string; phone: string } })?.data;
    return d ? { fullName: d.name, email: d.email, phone: d.phone } : null;
  }
}
