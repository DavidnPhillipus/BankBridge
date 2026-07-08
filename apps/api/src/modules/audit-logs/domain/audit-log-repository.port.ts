import type { RecordAuditLogInput } from './audit-actions';
import type { AuditLog } from './audit-log.entity';

export const AUDIT_LOG_REPOSITORY = Symbol('AUDIT_LOG_REPOSITORY');

export interface AuditLogPageQuery {
  page: number;
  pageSize: number;
  actorId?: string;
  action?: string;
  resourceType?: string;
}

export interface AuditLogPageResult {
  data: AuditLog[];
  total: number;
}

export interface AuditLogRepository {
  append(input: RecordAuditLogInput): Promise<AuditLog>;
  findPage(query: AuditLogPageQuery): Promise<AuditLogPageResult>;
}
