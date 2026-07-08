import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/interface/decorators/current-user.decorator';
import { Roles } from '../../auth/interface/decorators/roles.decorator';
import { ListAuditLogsUseCase } from '../application/list-audit-logs.use-case';
import type { AuditLogPage } from '../application/list-audit-logs.use-case';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@Controller({ path: 'audit-logs', version: '1' })
export class AuditLogsController {
  constructor(private readonly listAuditLogs: ListAuditLogsUseCase) {}

  @Get()
  @ApiOperation({ summary: 'List audit logs for the current user' })
  list(
    @CurrentUser('id') userId: string,
    @Query() query: AuditLogQueryDto,
  ): Promise<AuditLogPage> {
    return this.listAuditLogs.execute(userId, {
      page: query.page,
      pageSize: query.pageSize,
      action: query.action,
      resourceType: query.resourceType,
    });
  }

  @Get('admin')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List all audit logs (admin only)' })
  adminList(@Query() query: AuditLogQueryDto): Promise<AuditLogPage> {
    return this.listAuditLogs.execute('', {
      page: query.page,
      pageSize: query.pageSize,
      action: query.action,
      resourceType: query.resourceType,
      actorId: query.actorId,
      adminView: true,
    });
  }
}
