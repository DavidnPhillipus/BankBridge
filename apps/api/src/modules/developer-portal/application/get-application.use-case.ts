import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Application as ApplicationDto } from '@bankbridge/contracts';
import {
  APPLICATION_REPOSITORY,
  type ApplicationRepository,
} from '../domain/application-repository.port';

@Injectable()
export class GetApplicationUseCase {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applications: ApplicationRepository,
  ) {}

  async execute(ownerId: string, id: string): Promise<ApplicationDto> {
    const application = await this.applications.findByIdForOwner(ownerId, id);
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return application.toDto();
  }
}
