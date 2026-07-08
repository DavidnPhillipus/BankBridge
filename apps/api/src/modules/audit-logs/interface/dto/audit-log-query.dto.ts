import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { paginationQuerySchema } from '@bankbridge/contracts';

export const auditLogQuerySchema = paginationQuerySchema.extend({
  action: z.string().optional(),
  resourceType: z.string().optional(),
  actorId: z.string().uuid().optional(),
});

export class AuditLogQueryDto extends createZodDto(auditLogQuerySchema) {}
