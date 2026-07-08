import { Injectable } from '@nestjs/common';
import type { AccountType } from '@bankbridge/contracts';
import type {
  BonRawAccount,
  BonRawTransaction,
} from '../../../bank-adapters/infrastructure/mock/bank-of-namibia.adapter';
import type { BankNormalizer } from '../../domain/bank-normalizer.port';
import type {
  NormalizedAccount,
  NormalizedBalance,
  NormalizedIdentity,
  NormalizedTransaction,
} from '../../domain/normalized-models';
import { last4, money, parseDdMmYyyy } from './helpers';

const ACCOUNT_TYPE: Record<BonRawAccount['category'], AccountType> = {
  CQ: 'CHECKING',
  SV: 'SAVINGS',
  CC: 'CREDIT',
};

@Injectable()
export class BankOfNamibiaNormalizer implements BankNormalizer {
  readonly adapterKey = 'bank_of_namibia';

  normalizeAccounts(raw: unknown): NormalizedAccount[] {
    const list = (raw as { accountList?: BonRawAccount[] })?.accountList ?? [];
    return list.map((a) => ({
      externalId: a.number,
      name: a.title,
      type: ACCOUNT_TYPE[a.category],
      mask: last4(a.pan),
      currency: a.ledgerBalance.ccy,
      balance: money(a.ledgerBalance.value),
      available: money(a.availableBalance.value),
    }));
  }

  normalizeBalance(raw: unknown): NormalizedBalance | null {
    const d = raw as {
      number?: string;
      ledgerBalance?: { value: number; ccy: string };
      availableBalance?: { value: number; ccy: string };
    } | null;
    if (!d?.number || !d.ledgerBalance || !d.availableBalance) return null;
    return {
      externalId: d.number,
      current: money(d.ledgerBalance.value),
      available: money(d.availableBalance.value),
      currency: d.ledgerBalance.ccy,
    };
  }

  normalizeTransactions(raw: unknown): NormalizedTransaction[] {
    const entries = (raw as { entries?: BonRawTransaction[] })?.entries ?? [];
    return entries.map((t) => ({
      externalId: t.entryRef,
      accountExternalId: t.number,
      amount: money(Math.abs(t.amount.value)),
      currency: t.amount.ccy,
      type: t.drCr === 'D' ? 'DEBIT' : 'CREDIT',
      status: 'POSTED',
      description: t.reference,
      merchantName: t.party,
      categoryName: t.classification,
      bookedAt: parseDdMmYyyy(t.valueDate),
    }));
  }

  normalizeIdentity(raw: unknown): NormalizedIdentity | null {
    const d = (raw as { holder?: { name: string; email: string; phone: string } })
      ?.holder;
    return d ? { fullName: d.name, email: d.email, phone: d.phone } : null;
  }
}
