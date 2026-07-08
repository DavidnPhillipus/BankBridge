import { Module } from '@nestjs/common';
import { AuditLogService } from './application/audit-log.service';
import { ListAuditLogsUseCase } from './application/list-audit-logs.use-case';
import { AUDIT_LOG_REPOSITORY } from './domain/audit-log-repository.port';
import { PrismaAuditLogRepository } from './infrastructure/prisma-audit-log.repository';
import { AuditLogsController } from './interface/audit-logs.controller';

/**
 * Audit Logs: append-only trail of sensitive actions. AuditLogService is exported
 * for other modules to record events after auth, consent, API key, etc.
 */
@Module({
  controllers: [AuditLogsController],
  providers: [
    AuditLogService,
    ListAuditLogsUseCase,
    { provide: AUDIT_LOG_REPOSITORY, useClass: PrismaAuditLogRepository },
  ],
  exports: [AuditLogService],
})
export class AuditLogsModule {}
