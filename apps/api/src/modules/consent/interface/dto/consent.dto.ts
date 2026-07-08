import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { consentStatusSchema, createConsentSchema } from '@bankbridge/contracts';

export class CreateConsentDto extends createZodDto(createConsentSchema) {}

// Optional ?status= filter on the list endpoint.
export class ListConsentsQueryDto extends createZodDto(
  z.object({ status: consentStatusSchema.optional() }),
) {}
