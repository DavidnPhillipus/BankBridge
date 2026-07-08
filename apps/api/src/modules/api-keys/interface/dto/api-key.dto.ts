import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { createApiKeySchema } from '@bankbridge/contracts';

export class CreateApiKeyDto extends createZodDto(createApiKeySchema) {}

// Required ?applicationId= when listing keys.
export class ListApiKeysQueryDto extends createZodDto(
  z.object({ applicationId: z.string().uuid() }),
) {}
