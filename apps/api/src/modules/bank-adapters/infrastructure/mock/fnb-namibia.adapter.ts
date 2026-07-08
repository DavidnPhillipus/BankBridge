import { Injectable } from '@nestjs/common';
import type {
  AdapterContext,
  BankAdapterPort,
  TransactionQueryOptions,
} from '../../domain/bank-adapter.port';
import type { BaseAccountType } from '../../domain/mock/base-models';
import { MockDataFactory } from './mock-data.factory';

// --- FNB Namibia raw dialect --------------------------------------------------
// snake_case + abbreviations; splits balance into `availableFunds`/`currentBalance`,
// uses positive `amt` with an explicit `direction`, `narrative`, and a date-only
// `txn_date`.
export interface FnbRawAccount {
  id: string;
  name: string;
  product_type: 'cheque' | 'savings' | 'credit';
  availableFunds: number;
  currentBalance: number;
  ccy: string;
  last4: string;
}
export interface FnbRawTransaction {
  txn_id: string;
  account_id: string;
  amt: number; // always positive
  direction: 'debit' | 'credit';
  ccy: string;
  narrative: string;
  merchant: string | null;
  cat: string;
  txn_date: string; // YYYY-MM-DD
}

const PRODUCT_TYPE: Record<BaseAccountType, FnbRawAccount['product_type']> = {
  CHECKING: 'cheque',
  SAVINGS: 'savings',
  CREDIT: 'credit',
};

@Injectable()
export class FnbNamibiaAdapter implements BankAdapterPort {
  readonly adapterKey = 'fnb_namibia';

  constructor(private readonly data: MockDataFactory) {}

  async getAccounts(ctx: AdapterContext): Promise<unknown> {
    const accounts = this.data.accounts(this.adapterKey, ctx).map(
      (a): FnbRawAccount => ({
        id: a.externalId,
        name: a.name,
        product_type: PRODUCT_TYPE[a.type],
        availableFunds: a.available,
        currentBalance: a.balance,
        ccy: a.currency,
        last4: a.mask,
      }),
    );
    return { accounts };
  }

  async getBalances(ctx: AdapterContext, accountExternalId: string): Promise<unknown> {
    const account = this.data
      .accounts(this.adapterKey, ctx)
      .find((a) => a.externalId === accountExternalId);
    if (!account) return null;
    return {
      account_id: account.externalId,
      currentBalance: account.balance,
      availableFunds: account.available,
      ccy: account.currency,
    };
  }

  async getTransactions(
    ctx: AdapterContext,
    accountExternalId: string,
    options?: TransactionQueryOptions,
  ): Promise<unknown> {
    const transactions = this.data
      .transactions(this.adapterKey, ctx, accountExternalId, options)
      .map(
        (t): FnbRawTransaction => ({
          txn_id: t.externalId,
          account_id: t.accountExternalId,
          amt: t.amount,
          direction: t.direction === 'DEBIT' ? 'debit' : 'credit',
          ccy: t.currency,
          narrative: t.description,
          merchant: t.merchant,
          cat: t.category,
          txn_date: t.bookedAt.toISOString().slice(0, 10),
        }),
      );
    return { transactions };
  }

  async getIdentity(ctx: AdapterContext): Promise<unknown> {
    const id = this.data.identity(this.adapterKey, ctx);
    return {
      customer: { full_name: id.fullName, email_address: id.email, msisdn: id.phone },
    };
  }
}
