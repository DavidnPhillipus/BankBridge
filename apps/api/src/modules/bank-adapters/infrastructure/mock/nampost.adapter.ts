import { Injectable } from '@nestjs/common';
import type {
  AdapterContext,
  BankAdapterPort,
  TransactionQueryOptions,
} from '../../domain/bank-adapter.port';
import type { BaseAccountType } from '../../domain/mock/base-models';
import { MockDataFactory } from './mock-data.factory';

// --- NamPost (NamPost Savings Bank) raw dialect ------------------------------
// Distinct twist: all monetary values are INTEGER CENTS (minor units), never
// decimals. Accounts under `data.accounts`; transactions as `movements` with a
// signed `amount_cents` and an ISO `timestamp`.
export interface NampostRawAccount {
  ref: string;
  label: string;
  kind: 'current' | 'savings' | 'credit';
  balance_cents: number;
  available_cents: number;
  currency: string;
  tail: string;
}
export interface NampostRawMovement {
  id: string;
  ref: string;
  amount_cents: number; // signed: negative = debit
  currency: string;
  note: string;
  merchant: string | null;
  group: string;
  timestamp: string; // ISO 8601
}

const KIND: Record<BaseAccountType, NampostRawAccount['kind']> = {
  CHECKING: 'current',
  SAVINGS: 'savings',
  CREDIT: 'credit',
};

const toCents = (value: number): number => Math.round(value * 100);

@Injectable()
export class NampostAdapter implements BankAdapterPort {
  readonly adapterKey = 'nampost';

  constructor(private readonly data: MockDataFactory) {}

  async getAccounts(ctx: AdapterContext): Promise<unknown> {
    const accounts = this.data.accounts(this.adapterKey, ctx).map(
      (a): NampostRawAccount => ({
        ref: a.externalId,
        label: a.name,
        kind: KIND[a.type],
        balance_cents: toCents(a.balance),
        available_cents: toCents(a.available),
        currency: a.currency,
        tail: a.mask,
      }),
    );
    return { data: { accounts } };
  }

  async getBalances(ctx: AdapterContext, accountExternalId: string): Promise<unknown> {
    const account = this.data
      .accounts(this.adapterKey, ctx)
      .find((a) => a.externalId === accountExternalId);
    if (!account) return { data: null };
    return {
      data: {
        ref: account.externalId,
        balance_cents: toCents(account.balance),
        available_cents: toCents(account.available),
        currency: account.currency,
      },
    };
  }

  async getTransactions(
    ctx: AdapterContext,
    accountExternalId: string,
    options?: TransactionQueryOptions,
  ): Promise<unknown> {
    const movements = this.data
      .transactions(this.adapterKey, ctx, accountExternalId, options)
      .map(
        (t): NampostRawMovement => ({
          id: t.externalId,
          ref: t.accountExternalId,
          amount_cents: t.direction === 'DEBIT' ? -toCents(t.amount) : toCents(t.amount),
          currency: t.currency,
          note: t.description,
          merchant: t.merchant,
          group: t.category,
          timestamp: t.bookedAt.toISOString(),
        }),
      );
    return { data: { movements } };
  }

  async getIdentity(ctx: AdapterContext): Promise<unknown> {
    const id = this.data.identity(this.adapterKey, ctx);
    return { member: { name: id.fullName, email: id.email, phone: id.phone } };
  }
}
