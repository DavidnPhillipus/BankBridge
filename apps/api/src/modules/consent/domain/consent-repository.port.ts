import type { ConsentScope, ConsentStatus } from '@bankbridge/contracts';
import type { Consent } from './consent.entity';

export const CONSENT_REPOSITORY = Symbol('CONSENT_REPOSITORY');

export interface CreateConsentData {
  userId: string;
  applicationId: string;
  bankId: string;
  scopes: ConsentScope[];
  expiresAt: Date;
}

export interface BankRef {
  id: string;
  adapterKey: string;
  name: string;
  isActive: boolean;
}

export interface ApplicationRef {
  id: string;
  name: string;
  isActive: boolean;
}

export interface ConsentRepository {
  create(data: CreateConsentData): Promise<Consent>;
  findById(id: string): Promise<Consent | null>;
  findManyByUser(userId: string, status?: ConsentStatus): Promise<Consent[]>;
  /** Active (ACTIVE + unexpired) consents for a user. */
  findActiveByUser(userId: string): Promise<Consent[]>;
  /** Existing effective consent for a user+bank, if any (used to avoid dupes). */
  findEffectiveByUserBank(userId: string, bankId: string): Promise<Consent | null>;
  revoke(id: string): Promise<void>;

  // Lookups used for validation + denormalized names.
  getBankRef(bankId: string): Promise<BankRef | null>;
  getApplicationRef(applicationId: string): Promise<ApplicationRef | null>;
}
