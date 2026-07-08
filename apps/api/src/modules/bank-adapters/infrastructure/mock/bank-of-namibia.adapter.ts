import { Injectable } from '@nestjs/common';
import type {
  AdapterContext,
  BankAdapterPort,
  TransactionQueryOptions,
} from '../../domain/bank-adapter.port';
import type { BaseAccountType } from '../../domain/mock/base-models';
import { MockDataFactory } from './mock-data.factory';

// --- Bank of Namibia raw dialect ---------------------------------------------
// Core-banking flavour: `accountList`, terse 2-letter `category` codes, money as
// `{ value, ccy }` objects (`ledgerBalance`/`availableBalance`), transactions in
// `entries` with a `drCr` D/C flag and a DD/MM/YYYY `valueDate`.
export interface BonMoney {
  value: number;
  ccy: string;
}
export interface BonRawAccount {
  number: string;
  title: string;
  category: 'CQ' | 'SV' | 'CC';
  ledgerBalance: BonMoney;
  availableBalance: BonMoney;
  pan: string;
}
export interface BonRawTransaction {
  entryRef: string;
  number: string;
  drCr: 'D' | 'C';
  amount: BonMoney;
  reference: string;
  party: string | null;
  classification: string;
  valueDate: string; // DD/MM/YYYY
}

const CATEGORY: Record<BaseAccountType, BonRawAccount['category']> = {
  CHECKING: 'CQ',
  SAVINGS: 'SV',
  CREDIT: 'CC',
};

function toDdMmYyyy(date: Date): string {
  const d = String(date.getUTCDate()).padStart(2, '0');
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${d}/${m}/${date.getUTCFullYear()}`;
}

@Injectable()
export class BankOfNamibiaAdapter implements BankAdapterPort {
  readonly adapterKey = 'bank_of_namibia';

  constructor(private readonly data: MockDataFactory) {}

  async getAccounts(ctx: AdapterContext): Promise<unknown> {
    const accountList = this.data.accounts(this.adapterKey, ctx).map(
      (a): BonRawAccount => ({
        number: a.externalId,
        title: a.name,
        category: CATEGORY[a.type],
        ledgerBalance: { value: a.balance, ccy: a.currency },
        availableBalance: { value: a.available, ccy: a.currency },
        pan: `**** **** **** ${a.mask}`,
      }),
    );
    return { accountList };
  }

  async getBalances(ctx: AdapterContext, accountExternalId: string): Promise<unknown> {
    const account = this.data
      .accounts(this.adapterKey, ctx)
      .find((a) => a.externalId === accountExternalId);
    if (!account) return null;
    return {
      number: account.externalId,
      ledgerBalance: { value: account.balance, ccy: account.currency },
      availableBalance: { value: account.available, ccy: account.currency },
    };
  }

  async getTransactions(
    ctx: AdapterContext,
    accountExternalId: string,
    options?: TransactionQueryOptions,
  ): Promise<unknown> {
    const entries = this.data
      .transactions(this.adapterKey, ctx, accountExternalId, options)
      .map(
        (t): BonRawTransaction => ({
          entryRef: t.externalId,
          number: t.accountExternalId,
          drCr: t.direction === 'DEBIT' ? 'D' : 'C',
          amount: { value: t.amount, ccy: t.currency },
          reference: t.description,
          party: t.merchant,
          classification: t.category,
          valueDate: toDdMmYyyy(t.bookedAt),
        }),
      );
    return { entries };
  }

  async getIdentity(ctx: AdapterContext): Promise<unknown> {
    const id = this.data.identity(this.adapterKey, ctx);
    return { holder: { name: id.fullName, email: id.email, phone: id.phone } };
  }
}
