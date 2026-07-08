import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Application as ApplicationDto } from '@bankbridge/contracts';
import {
  APPLICATION_REPOSITORY,
  type ApplicationRepository,
  type UpdateApplicationData,
} from '../domain/application-repository.port';

@Injectable()
export class UpdateApplicationUseCase {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applications: ApplicationRepository,
  ) {}

  async execute(
    ownerId: string,
    id: string,
    data: UpdateApplicationData,
  ): Promise<ApplicationDto> {
    const existing = await this.applications.findByIdForOwner(ownerId, id);
    if (!existing) {
      throw new NotFoundException('Application not found');
    }
    const updated = await this.applications.update(id, data);
    return updated.toDto();
  }
}
