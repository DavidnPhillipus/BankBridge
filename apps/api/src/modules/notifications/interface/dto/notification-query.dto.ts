import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { paginationQuerySchema } from '@bankbridge/contracts';

const booleanFlag = z
  .enum(['true', 'false', '1', '0'])
  .transform((v) => v === 'true' || v === '1');

export const notificationQuerySchema = paginationQuerySchema.extend({
  unreadOnly: booleanFlag.default('false'),
});

export class NotificationQueryDto extends createZodDto(notificationQuerySchema) {}
