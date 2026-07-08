import { createHash, randomBytes } from 'node:crypto';

export interface GeneratedKey {
  /** Public, non-secret lookup handle stored in the DB and shown in listings. */
  prefix: string;
  /** The full secret key — returned to the caller exactly once. */
  fullKey: string;
  /** SHA-256 of the full key — the only representation persisted. */
  hash: string;
}

/**
 * Generates API keys of the form `bbk_<prefix>.<secret>`.
 *
 * The prefix is a fast, unique lookup handle (safe to display); the secret half
 * is never stored — only its SHA-256 hash — so a DB leak cannot reveal usable
 * keys. Verification (Step 14) looks up by prefix, then compares hashes.
 */
export class KeyGenerator {
  static generate(): GeneratedKey {
    const prefix = `bbk_${randomBytes(6).toString('hex')}`; // 12 hex chars
    const secret = randomBytes(24).toString('hex'); // 48 hex chars
    const fullKey = `${prefix}.${secret}`;
    const hash = KeyGenerator.hash(fullKey);
    return { prefix, fullKey, hash };
  }

  static hash(fullKey: string): string {
    return createHash('sha256').update(fullKey).digest('hex');
  }

  /** Extracts the lookup prefix from a presented key, or null if malformed. */
  static extractPrefix(fullKey: string): string | null {
    const [prefix] = fullKey.split('.');
    return prefix && prefix.startsWith('bbk_') ? prefix : null;
  }
}
