import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { createApplicationSchema } from '@bankbridge/contracts';

export class CreateApplicationDto extends createZodDto(createApplicationSchema) {}

// All fields optional — a partial update of a developer's application.
export const updateApplicationSchema = z
  .object({
    name: z.string().min(2).max(80),
    description: z.string().max(500).nullable(),
    redirectUris: z.array(z.string().url()),
    isActive: z.boolean(),
  })
  .partial();

export class UpdateApplicationDto extends createZodDto(updateApplicationSchema) {}
