import { Inject, Injectable } from '@nestjs/common';
import type { RecordAuditLogInput } from '../domain/audit-actions';
import {
  AUDIT_LOG_REPOSITORY,
  type AuditLogRepository,
} from '../domain/audit-log-repository.port';

/**
 * Append-only audit trail. Other modules call record() after sensitive actions.
 * Failures are not swallowed — if audit persistence fails, the caller should know.
 */
@Injectable()
export class AuditLogService {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY) private readonly auditLogs: AuditLogRepository,
  ) {}

  record(input: RecordAuditLogInput): Promise<void> {
    return this.auditLogs.append(input).then(() => undefined);
  }
}
