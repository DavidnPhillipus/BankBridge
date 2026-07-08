import { Injectable } from '@nestjs/common';
import type {
  AdapterContext,
  BankAdapterPort,
  TransactionQueryOptions,
} from '../../domain/bank-adapter.port';
import type { BaseAccountType } from '../../domain/mock/base-models';
import { MockDataFactory } from './mock-data.factory';

// --- Nedbank Namibia raw dialect ---------------------------------------------
// Terse snake_case under a `results` array; uses `current_balance`/`avail_balance`,
// a signed `value`, `curr`, and an epoch-millis `posted_at`.
export interface NedbankRawAccount {
  acc_no: string;
  acc_name: string;
  acc_type: 'CURRENT' | 'SAVINGS' | 'CREDIT';
  current_balance: number;
  avail_balance: number;
  curr: string;
  masked: string;
}
export interface NedbankRawTransaction {
  ref: string;
  acc_no: string;
  value: number; // signed: negative = debit
  curr: string;
  desc: string;
  merchant: string | null;
  category: string;
  posted_at: number; // epoch millis
}

const ACC_TYPE: Record<BaseAccountType, NedbankRawAccount['acc_type']> = {
  CHECKING: 'CURRENT',
  SAVINGS: 'SAVINGS',
  CREDIT: 'CREDIT',
};

@Injectable()
export class NedbankNamibiaAdapter implements BankAdapterPort {
  readonly adapterKey = 'nedbank_namibia';

  constructor(private readonly data: MockDataFactory) {}

  async getAccounts(ctx: AdapterContext): Promise<unknown> {
    const results = this.data.accounts(this.adapterKey, ctx).map(
      (a): NedbankRawAccount => ({
        acc_no: a.externalId,
        acc_name: a.name,
        acc_type: ACC_TYPE[a.type],
        current_balance: a.balance,
        avail_balance: a.available,
        curr: a.currency,
        masked: `xxxx${a.mask}`,
      }),
    );
    return { results, count: results.length };
  }

  async getBalances(ctx: AdapterContext, accountExternalId: string): Promise<unknown> {
    const account = this.data
      .accounts(this.adapterKey, ctx)
      .find((a) => a.externalId === accountExternalId);
    if (!account) return null;
    return {
      acc_no: account.externalId,
      current_balance: account.balance,
      avail_balance: account.available,
      curr: account.currency,
    };
  }

  async getTransactions(
    ctx: AdapterContext,
    accountExternalId: string,
    options?: TransactionQueryOptions,
  ): Promise<unknown> {
    const results = this.data
      .transactions(this.adapterKey, ctx, accountExternalId, options)
      .map(
        (t): NedbankRawTransaction => ({
          ref: t.externalId,
          acc_no: t.accountExternalId,
          value: t.direction === 'DEBIT' ? -t.amount : t.amount,
          curr: t.currency,
          desc: t.description,
          merchant: t.merchant,
          category: t.category,
          posted_at: t.bookedAt.getTime(),
        }),
      );
    return { results, count: results.length };
  }

  async getIdentity(ctx: AdapterContext): Promise<unknown> {
    const id = this.data.identity(this.adapterKey, ctx);
    return { profile: { name: id.fullName, email: id.email, cell: id.phone } };
  }
}
