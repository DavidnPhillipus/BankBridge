/**
 * BankAdapterPort — the single contract every bank integration must satisfy.
 *
 * This is the architectural heart of FinConnect. Today the implementations are
 * mock adapters that return intentionally different JSON shapes; tomorrow they
 * become real HTTP/OAuth2 clients. Consumers (the API Gateway) only ever depend
 * on this interface, so swapping mock -> real is a provider change, nothing more.
 *
 * NOTE: methods return `unknown` on purpose. Each bank speaks its own dialect,
 * so the raw payload is untyped at this boundary — exactly like a real bank API.
 * The API Gateway's Normalizer (Step 7) turns these raw shapes into the canonical
 * models from @bankbridge/contracts.
 */

/** DI token for the collection of all registered bank adapters. */
export const BANK_ADAPTERS = Symbol('BANK_ADAPTERS');

/**
 * Identifies the customer at the bank. In a real integration this would carry
 * the bank-issued access token obtained via OAuth2. For mocks it is an opaque,
 * stable reference (derived from the platform user) so data is deterministic.
 */
export interface AdapterContext {
  customerRef: string;
}

export interface TransactionQueryOptions {
  /** Max number of transactions to return (adapter may cap this). */
  limit?: number;
  /** Only include transactions on/after this date. */
  since?: Date;
}

export interface BankAdapterPort {
  /** Must equal the Bank.adapterKey stored in the database. */
  readonly adapterKey: string;

  getAccounts(ctx: AdapterContext): Promise<unknown>;
  getBalances(ctx: AdapterContext, accountExternalId: string): Promise<unknown>;
  getTransactions(
    ctx: AdapterContext,
    accountExternalId: string,
    options?: TransactionQueryOptions,
  ): Promise<unknown>;
  getIdentity(ctx: AdapterContext): Promise<unknown>;
}
