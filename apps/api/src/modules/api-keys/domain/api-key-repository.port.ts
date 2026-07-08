import type { AppEnvironment, ConsentScope } from '@bankbridge/contracts';
import type { ApiKey } from './api-key.entity';

export const API_KEY_REPOSITORY = Symbol('API_KEY_REPOSITORY');

export interface CreateApiKeyData {
  applicationId: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  scopes: ConsentScope[];
  environment: AppEnvironment;
  expiresAt: Date | null;
}

export interface ApiKeyRepository {
  create(data: CreateApiKeyData): Promise<ApiKey>;
  findByApplication(applicationId: string): Promise<ApiKey[]>;
  findById(id: string): Promise<ApiKey | null>;
  /** Lookup by public prefix — used by the public API auth guard (Step 14). */
  findByPrefix(keyPrefix: string): Promise<ApiKey | null>;
  /** Prefix lookup + hash compare + usability check. Returns null if invalid. */
  verifyPresentedKey(fullKey: string): Promise<ApiKey | null>;
  revoke(id: string): Promise<void>;
  touchLastUsed(id: string): Promise<void>;
}
