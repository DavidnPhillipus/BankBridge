import type {
  NormalizedAccount,
  NormalizedBalance,
  NormalizedIdentity,
  NormalizedTransaction,
} from './normalized-models';

/** DI token for the collection of all registered bank normalizers. */
export const BANK_NORMALIZERS = Symbol('BANK_NORMALIZERS');

/**
 * Anti-Corruption Layer: translates a specific bank's raw payload into the
 * canonical normalized models. One implementation per bank dialect, paired to
 * the adapter of the same adapterKey.
 */
export interface BankNormalizer {
  readonly adapterKey: string;
  normalizeAccounts(raw: unknown): NormalizedAccount[];
  normalizeBalance(raw: unknown): NormalizedBalance | null;
  normalizeTransactions(raw: unknown): NormalizedTransaction[];
  normalizeIdentity(raw: unknown): NormalizedIdentity | null;
}
