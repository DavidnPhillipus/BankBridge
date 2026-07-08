import { Injectable } from '@nestjs/common';
import type {
  AdapterContext,
  BankAdapterPort,
  TransactionQueryOptions,
} from '../../domain/bank-adapter.port';
import type { BaseAccountType } from '../../domain/mock/base-models';
import { MockDataFactory } from './mock-data.factory';

// --- Standard Bank Namibia raw dialect ---------------------------------------
// Open Banking UK style: PascalCase, deeply nested, monetary amounts as STRINGS
// inside `{ Amount, Currency }`, CreditDebitIndicator, and BookingDateTime.
export interface ObAmount {
  Amount: string; // e.g. "1234.56"
  Currency: string;
}
export interface StandardRawAccount {
  AccountId: string;
  Nickname: string;
  AccountSubType: 'CurrentAccount' | 'Savings' | 'CreditCard';
  Currency: string;
  Balance: { Amount: ObAmount; Type: 'InterimAvailable' };
  MaskedPan: string;
}
export interface StandardRawTransaction {
  TransactionId: string;
  AccountId: string;
  Amount: ObAmount;
  CreditDebitIndicator: 'Debit' | 'Credit';
  Status: 'Booked';
  TransactionInformation: string;
  MerchantDetails?: { MerchantName: string };
  ProprietaryBankTransactionCode: { Code: string };
  BookingDateTime: string; // ISO 8601
}

const SUB_TYPE: Record<BaseAccountType, StandardRawAccount['AccountSubType']> = {
  CHECKING: 'CurrentAccount',
  SAVINGS: 'Savings',
  CREDIT: 'CreditCard',
};

@Injectable()
export class StandardBankNamibiaAdapter implements BankAdapterPort {
  readonly adapterKey = 'standard_bank_namibia';

  constructor(private readonly data: MockDataFactory) {}

  async getAccounts(ctx: AdapterContext): Promise<unknown> {
    const Account = this.data.accounts(this.adapterKey, ctx).map(
      (a): StandardRawAccount => ({
        AccountId: a.externalId,
        Nickname: a.name,
        AccountSubType: SUB_TYPE[a.type],
        Currency: a.currency,
        Balance: {
          Amount: { Amount: a.available.toFixed(2), Currency: a.currency },
          Type: 'InterimAvailable',
        },
        MaskedPan: `************${a.mask}`,
      }),
    );
    return { Data: { Account }, Meta: { TotalPages: 1 } };
  }

  async getBalances(ctx: AdapterContext, accountExternalId: string): Promise<unknown> {
    const account = this.data
      .accounts(this.adapterKey, ctx)
      .find((a) => a.externalId === accountExternalId);
    if (!account) return { Data: { Balance: [] } };
    return {
      Data: {
        Balance: [
          {
            AccountId: account.externalId,
            Amount: { Amount: account.available.toFixed(2), Currency: account.currency },
            Type: 'InterimAvailable',
          },
          {
            AccountId: account.externalId,
            Amount: { Amount: account.balance.toFixed(2), Currency: account.currency },
            Type: 'ClosingBooked',
          },
        ],
      },
    };
  }

  async getTransactions(
    ctx: AdapterContext,
    accountExternalId: string,
    options?: TransactionQueryOptions,
  ): Promise<unknown> {
    const Transaction = this.data
      .transactions(this.adapterKey, ctx, accountExternalId, options)
      .map((t): StandardRawTransaction => {
        const base: StandardRawTransaction = {
          TransactionId: t.externalId,
          AccountId: t.accountExternalId,
          Amount: { Amount: t.amount.toFixed(2), Currency: t.currency },
          CreditDebitIndicator: t.direction === 'DEBIT' ? 'Debit' : 'Credit',
          Status: 'Booked',
          TransactionInformation: t.description,
          ProprietaryBankTransactionCode: { Code: t.category },
          BookingDateTime: t.bookedAt.toISOString(),
        };
        if (t.merchant) base.MerchantDetails = { MerchantName: t.merchant };
        return base;
      });
    return { Data: { Transaction }, Meta: { TotalPages: 1 } };
  }

  async getIdentity(ctx: AdapterContext): Promise<unknown> {
    const id = this.data.identity(this.adapterKey, ctx);
    return {
      Data: { Party: { Name: id.fullName, EmailAddress: id.email, Phone: id.phone } },
    };
  }
}
