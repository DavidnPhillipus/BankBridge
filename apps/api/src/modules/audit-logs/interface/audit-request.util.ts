import type { Request } from 'express';

/** Extracts IP and user-agent for audit log entries from an HTTP request. */
export function auditMetaFromRequest(req: Request): {
  ip: string | null;
  userAgent: string | null;
} {
  const forwarded = req.headers['x-forwarded-for'];
  const ip =
    (typeof forwarded === 'string' ? forwarded.split(',')[0]?.trim() : null) ??
    req.ip ??
    null;
  const userAgent =
    typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : null;
  return { ip, userAgent };
}
