import { z } from 'zod';
import { consentScopeSchema, consentStatusSchema } from '../common/enums';

export const consentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  applicationId: z.string().uuid(),
  applicationName: z.string(),
  bankId: z.string().uuid(),
  bankName: z.string(),
  status: consentStatusSchema,
  scopes: z.array(consentScopeSchema),
  expiresAt: z.string(),
  createdAt: z.string(),
});
export type Consent = z.infer<typeof consentSchema>;

/** Payload to grant a new consent (POST /consents). */
export const createConsentSchema = z.object({
  applicationId: z.string().uuid(),
  bankId: z.string().uuid(),
  scopes: z.array(consentScopeSchema).min(1),
  // Optional consent lifetime in days (defaults applied server-side).
  durationDays: z.number().int().positive().max(365).optional(),
});
export type CreateConsentInput = z.infer<typeof createConsentSchema>;
