import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import {
  APPLICATION_REPOSITORY,
  type ApplicationRepository,
} from '../domain/application-repository.port';

/** Minimal app info shown when a customer picks who to grant consent to. */
export const publicApplicationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
});
export type PublicApplication = z.infer<typeof publicApplicationSchema>;

@Injectable()
export class ListPublicApplicationsUseCase {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applications: ApplicationRepository,
  ) {}

  async execute(): Promise<PublicApplication[]> {
    // Catalog of active apps any customer may authorize (consent grant UI).
    const apps = await this.applications.findAllActive();
    return apps.map((a) => {
      const dto = a.toDto();
      return { id: dto.id, name: dto.name, description: dto.description };
    });
  }
}
