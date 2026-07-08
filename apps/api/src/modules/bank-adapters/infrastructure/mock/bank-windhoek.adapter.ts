import { Injectable } from '@nestjs/common';
import type {
  AdapterContext,
  BankAdapterPort,
  TransactionQueryOptions,
} from '../../domain/bank-adapter.port';
import type { BaseAccountType } from '../../domain/mock/base-models';
import { MockDataFactory } from './mock-data.factory';

// --- Bank Windhoek raw dialect ------------------------------------------------
// Flat JSON under a `data` envelope; uses `balance` / `availableBalance` and a
// signed numeric `amount` with an ISO `date`.
export interface WindhoekRawAccount {
  accountId: string;
  nickname: string;
  accountType: 'CURRENT' | 'SAVINGS' | 'CREDIT_CARD';
  balance: number;
  availableBalance: number;
  currency: string;
  maskedNumber: string;
}
export interface WindhoekRawTransaction {
  transactionId: string;
  accountId: string;
  amount: number; // signed: negative = debit
  currency: string;
  description: string;
  merchantName: string | null;
  category: string;
  date: string; // ISO 8601
}

const ACCOUNT_TYPE: Record<BaseAccountType, WindhoekRawAccount['accountType']> = {
  CHECKING: 'CURRENT',
  SAVINGS: 'SAVINGS',
  CREDIT: 'CREDIT_CARD',
};

@Injectable()
export class BankWindhoekAdapter implements BankAdapterPort {
  readonly adapterKey = 'bank_windhoek';

  constructor(private readonly data: MockDataFactory) {}

  async getAccounts(ctx: AdapterContext): Promise<unknown> {
    const accounts = this.data.accounts(this.adapterKey, ctx).map(
      (a): WindhoekRawAccount => ({
        accountId: a.externalId,
        nickname: a.name,
        accountType: ACCOUNT_TYPE[a.type],
        balance: a.balance,
        availableBalance: a.available,
        currency: a.currency,
        maskedNumber: `****${a.mask}`,
      }),
    );
    return { status: 'success', data: { accounts } };
  }

  async getBalances(ctx: AdapterContext, accountExternalId: string): Promise<unknown> {
    const account = this.data
      .accounts(this.adapterKey, ctx)
      .find((a) => a.externalId === accountExternalId);
    return {
      status: 'success',
      data: account
        ? {
            accountId: account.externalId,
            balance: account.balance,
            availableBalance: account.available,
            currency: account.currency,
          }
        : null,
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
        (t): WindhoekRawTransaction => ({
          transactionId: t.externalId,
          accountId: t.accountExternalId,
          amount: t.direction === 'DEBIT' ? -t.amount : t.amount,
          currency: t.currency,
          description: t.description,
          merchantName: t.merchant,
          category: t.category,
          date: t.bookedAt.toISOString(),
        }),
      );
    return { status: 'success', data: { transactions } };
  }

  async getIdentity(ctx: AdapterContext): Promise<unknown> {
    const id = this.data.identity(this.adapterKey, ctx);
    return {
      status: 'success',
      data: { name: id.fullName, email: id.email, phone: id.phone },
    };
  }
}
