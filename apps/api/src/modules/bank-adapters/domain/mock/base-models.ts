/**
 * Internal "true" representation of a customer's data at a bank, BEFORE each
 * adapter obfuscates it into its own dialect. The mock data factory produces
 * these; adapters transform them into bank-specific raw JSON; the gateway
 * normalizes back to canonical models. This models the real-world round-trip.
 */

export type BaseAccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT';

export interface BaseAccount {
  externalId: string;
  name: string;
  type: BaseAccountType;
  mask: string;
  currency: string;
  balance: number;
  available: number;
}

export type BaseDirection = 'DEBIT' | 'CREDIT';

export interface BaseTransaction {
  externalId: string;
  accountExternalId: string;
  amount: number; // always positive; sign is conveyed by `direction`
  direction: BaseDirection;
  currency: string;
  description: string;
  merchant: string | null;
  category: string; // matches a seeded Category.name
  bookedAt: Date;
}

export interface BaseIdentity {
  fullName: string;
  email: string;
  phone: string;
}
