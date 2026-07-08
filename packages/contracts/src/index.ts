/**
 * @bankbridge/contracts
 *
 * Single source of truth for canonical data models shared across the API and
 * Web apps. Bank-specific shapes never appear here — only the normalized
 * platform models. Concrete model schemas (Account, Transaction, Consent, ...)
 * are added in their respective build steps.
 */
export * from './common/roles';
export * from './auth';
