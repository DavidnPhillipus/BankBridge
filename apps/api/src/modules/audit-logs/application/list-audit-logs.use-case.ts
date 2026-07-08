import { Inject, Injectable } from '@nestjs/common';
import type { AuditLog, PaginationMeta } from '@bankbridge/contracts';
import {
  AUDIT_LOG_REPOSITORY,
  type AuditLogRepository,
} from '../domain/audit-log-repository.port';

export interface ListAuditLogsInput {
  page: number;
  pageSize: number;
  action?: string;
  resourceType?: string;
  /** When set (admin), lists all actors; otherwise scoped to this user. */
  actorId?: string;
  adminView?: boolean;
}

export interface AuditLogPage {
  data: AuditLog[];
  meta: PaginationMeta;
}

@Injectable()
export class ListAuditLogsUseCase {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY) private readonly auditLogs: AuditLogRepository,
  ) {}

  async execute(userId: string, input: ListAuditLogsInput): Promise<AuditLogPage> {
    const actorFilter = input.adminView ? input.actorId : userId;
    const { data, total } = await this.auditLogs.findPage({
      page: input.page,
      pageSize: input.pageSize,
      actorId: actorFilter,
      action: input.action,
      resourceType: input.resourceType,
    });

    return {
      data: data.map((log) => log.toDto()),
      meta: {
        page: input.page,
        pageSize: input.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / input.pageSize)),
      },
    };
  }
}
