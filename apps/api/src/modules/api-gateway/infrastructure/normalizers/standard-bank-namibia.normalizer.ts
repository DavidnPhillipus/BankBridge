import { Injectable } from '@nestjs/common';
import type { AccountType } from '@bankbridge/contracts';
import type {
  ObAmount,
  StandardRawAccount,
  StandardRawTransaction,
} from '../../../bank-adapters/infrastructure/mock/standard-bank-namibia.adapter';
import type { BankNormalizer } from '../../domain/bank-normalizer.port';
import type {
  NormalizedAccount,
  NormalizedBalance,
  NormalizedIdentity,
  NormalizedTransaction,
} from '../../domain/normalized-models';
import { last4, money } from './helpers';

const ACCOUNT_TYPE: Record<StandardRawAccount['AccountSubType'], AccountType> = {
  CurrentAccount: 'CHECKING',
  Savings: 'SAVINGS',
  CreditCard: 'CREDIT',
};

interface ObBalanceEntry {
  AccountId: string;
  Amount: ObAmount;
  Type: 'InterimAvailable' | 'ClosingBooked';
}

// Standard Bank encodes money as strings inside { Amount, Currency }.
const parseAmount = (a: ObAmount): number => money(parseFloat(a.Amount));

@Injectable()
export class StandardBankNamibiaNormalizer implements BankNormalizer {
  readonly adapterKey = 'standard_bank_namibia';

  normalizeAccounts(raw: unknown): NormalizedAccount[] {
    const accounts =
      (raw as { Data?: { Account?: StandardRawAccount[] } })?.Data?.Account ?? [];
    return accounts.map((a) => {
      const value = parseAmount(a.Balance.Amount);
      return {
        externalId: a.AccountId,
        name: a.Nickname,
        type: ACCOUNT_TYPE[a.AccountSubType],
        mask: last4(a.MaskedPan),
        currency: a.Currency,
        balance: value,
        available: value,
      };
    });
  }

  normalizeBalance(raw: unknown): NormalizedBalance | null {
    const balances =
      (raw as { Data?: { Balance?: ObBalanceEntry[] } })?.Data?.Balance ?? [];
    if (balances.length === 0) return null;
    const available = balances.find((b) => b.Type === 'InterimAvailable');
    const booked = balances.find((b) => b.Type === 'ClosingBooked');
    const ref = booked ?? available!;
    return {
      externalId: ref.AccountId,
      current: parseAmount((booked ?? ref).Amount),
      available: parseAmount((available ?? ref).Amount),
      currency: ref.Amount.Currency,
    };
  }

  normalizeTransactions(raw: unknown): NormalizedTransaction[] {
    const txns =
      (raw as { Data?: { Transaction?: StandardRawTransaction[] } })?.Data
        ?.Transaction ?? [];
    return txns.map((t) => ({
      externalId: t.TransactionId,
      accountExternalId: t.AccountId,
      amount: parseAmount(t.Amount),
      currency: t.Amount.Currency,
      type: t.CreditDebitIndicator === 'Debit' ? 'DEBIT' : 'CREDIT',
      status: 'POSTED',
      description: t.TransactionInformation,
      merchantName: t.MerchantDetails?.MerchantName ?? null,
      categoryName: t.ProprietaryBankTransactionCode?.Code ?? null,
      bookedAt: new Date(t.BookingDateTime),
    }));
  }

  normalizeIdentity(raw: unknown): NormalizedIdentity | null {
    const p = (raw as {
      Data?: { Party?: { Name: string; EmailAddress: string; Phone: string } };
    })?.Data?.Party;
    return p ? { fullName: p.Name, email: p.EmailAddress, phone: p.Phone } : null;
  }
}
