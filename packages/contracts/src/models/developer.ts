import { z } from 'zod';
import { appEnvironmentSchema, consentScopeSchema } from '../common/enums';

export const applicationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  environment: appEnvironmentSchema,
  redirectUris: z.array(z.string()),
  isActive: z.boolean(),
  createdAt: z.string(),
});
export type Application = z.infer<typeof applicationSchema>;

export const createApplicationSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(500).optional(),
  environment: appEnvironmentSchema.default('SANDBOX'),
  redirectUris: z.array(z.string().url()).default([]),
});
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

/** API key metadata (never includes the secret except on creation). */
export const apiKeySchema = z.object({
  id: z.string().uuid(),
  applicationId: z.string().uuid(),
  name: z.string(),
  keyPrefix: z.string(),
  scopes: z.array(consentScopeSchema),
  environment: appEnvironmentSchema,
  lastUsedAt: z.string().nullable(),
  expiresAt: z.string().nullable(),
  revokedAt: z.string().nullable(),
  createdAt: z.string(),
});
export type ApiKey = z.infer<typeof apiKeySchema>;

export const createApiKeySchema = z.object({
  applicationId: z.string().uuid(),
  name: z.string().min(2).max(80),
  scopes: z.array(consentScopeSchema).min(1),
  expiresInDays: z.number().int().positive().max(730).optional(),
});
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;

/** Returned only once, immediately after creation. */
export const createdApiKeySchema = apiKeySchema.extend({
  secret: z.string(),
});
export type CreatedApiKey = z.infer<typeof createdApiKeySchema>;
