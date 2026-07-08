import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Query strings are strings; z.coerce.boolean() treats "false" as true, so the
// force flag is parsed explicitly (only "true"/"1" mean true).
const booleanFlag = z
  .enum(['true', 'false', '1', '0'])
  .transform((v) => v === 'true' || v === '1');

export const insightsQuerySchema = z.object({
  months: z.coerce.number().int().positive().max(24).default(6),
  force: booleanFlag.default('false'),
});

export class InsightsQueryDto extends createZodDto(insightsQuerySchema) {}
