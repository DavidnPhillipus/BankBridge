import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Query strings are always strings, and z.coerce.boolean() treats "false" as
// true — so parse the flag explicitly (only "true"/"1" mean true).
const booleanFlag = z
  .enum(['true', 'false', '1', '0'])
  .transform((v) => v === 'true' || v === '1');

// Rolling window size in months (1-24) plus an optional force-refresh flag.
export const analyticsQuerySchema = z.object({
  months: z.coerce.number().int().positive().max(24).default(6),
  force: booleanFlag.default('false'),
});

export class AnalyticsQueryDto extends createZodDto(analyticsQuerySchema) {}
