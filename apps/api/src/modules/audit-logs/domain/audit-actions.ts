/** Canonical audit action names — keep stable for dashboards and SIEM filters. */
export const AuditAction = {
  AUTH_REGISTER: 'auth.register',
  AUTH_LOGIN: 'auth.login',
  AUTH_LOGOUT: 'auth.logout',
  CONSENT_GRANT: 'consent.grant',
  CONSENT_REVOKE: 'consent.revoke',
  API_KEY_CREATE: 'api_key.create',
  API_KEY_REVOKE: 'api_key.revoke',
  PUBLIC_API_ACCESS: 'public_api.access',
} as const;

export type AuditActionName = (typeof AuditAction)[keyof typeof AuditAction];

export interface RecordAuditLogInput {
  actorId?: string | null;
  action: AuditActionName | string;
  resourceType: string;
  resourceId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
}
