/**
 * @bankbridge/contracts
 *
 * Single source of truth for canonical data models shared across the API and
 * Web apps. Bank-specific shapes never appear here — only the normalized
 * platform models. Concrete model schemas (Account, Transaction, Consent, ...)
 * are added in their respective build steps.
 */
export * from './common/roles';
export * from './common/enums';
export * from './auth';
export * from './models/finance';
export * from './models/consent';
export * from './models/developer';
export * from './models/platform';
export * from './models/insights';
