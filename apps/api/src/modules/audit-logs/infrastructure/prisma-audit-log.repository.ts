import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import type { RecordAuditLogInput } from '../domain/audit-actions';
import { AuditLog } from '../domain/audit-log.entity';
import type {
  AuditLogPageQuery,
  AuditLogPageResult,
  AuditLogRepository,
} from '../domain/audit-log-repository.port';

@Injectable()
export class PrismaAuditLogRepository implements AuditLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async append(input: RecordAuditLogInput): Promise<AuditLog> {
    const record = await this.prisma.auditLog.create({
      data: {
        actorId: input.actorId ?? null,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId ?? null,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
        metadata: (input.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
    return this.toDomain(record);
  }

  async findPage(query: AuditLogPageQuery): Promise<AuditLogPageResult> {
    const where: Prisma.AuditLogWhereInput = {
      ...(query.actorId ? { actorId: query.actorId } : {}),
      ...(query.action ? { action: query.action } : {}),
      ...(query.resourceType ? { resourceType: query.resourceType } : {}),
    };

    const [records, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data: records.map((r) => this.toDomain(r)), total };
  }

  private toDomain(record: {
    id: string;
    actorId: string | null;
    action: string;
    resourceType: string;
    resourceId: string | null;
    ip: string | null;
    userAgent: string | null;
    metadata: Prisma.JsonValue | null;
    createdAt: Date;
  }): AuditLog {
    return new AuditLog({
      id: record.id,
      actorId: record.actorId,
      action: record.action,
      resourceType: record.resourceType,
      resourceId: record.resourceId,
      ip: record.ip,
      userAgent: record.userAgent,
      metadata: (record.metadata as Record<string, unknown> | null) ?? null,
      createdAt: record.createdAt,
    });
  }
}
