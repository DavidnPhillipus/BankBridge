import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { paginationQuerySchema } from '@bankbridge/contracts';

// Pagination (page/pageSize) plus an optional `since` date filter.
export const transactionQuerySchema = paginationQuerySchema.extend({
  since: z.coerce.date().optional(),
});

export class TransactionQueryDto extends createZodDto(transactionQuerySchema) {}
