import type {
  AccountType,
  TransactionStatus,
  TransactionType,
} from '@bankbridge/contracts';

/**
 * The ONE standard format. Every bank's raw dialect is mapped into these shapes
 * by a normalizer, so the rest of the platform never sees bank-specific JSON.
 *
 * These are keyed by the bank's `externalId` (not platform UUIDs) because they
 * originate upstream. The persistence layer (accounts/transactions modules)
 * assigns platform ids when it stores them.
 */

export interface NormalizedAccount {
  externalId: string;
  name: string;
  type: AccountType;
  mask: string | null;
  currency: string;
  balance: number;
  available: number;
}

export interface NormalizedTransaction {
  externalId: string;
  accountExternalId: string;
  /** Always positive; direction is carried by `type`. */
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  merchantName: string | null;
  categoryName: string | null;
  bookedAt: Date;
}

export interface NormalizedBalance {
  externalId: string;
  current: number;
  available: number;
  currency: string;
}

export interface NormalizedIdentity {
  fullName: string;
  email: string;
  phone: string;
}
