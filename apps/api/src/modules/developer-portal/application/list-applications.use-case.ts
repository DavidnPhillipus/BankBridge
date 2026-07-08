import { Inject, Injectable } from '@nestjs/common';
import type { Application as ApplicationDto } from '@bankbridge/contracts';
import {
  APPLICATION_REPOSITORY,
  type ApplicationRepository,
} from '../domain/application-repository.port';

@Injectable()
export class ListApplicationsUseCase {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applications: ApplicationRepository,
  ) {}

  async execute(ownerId: string): Promise<ApplicationDto[]> {
    const applications = await this.applications.findByOwner(ownerId);
    return applications.map((a) => a.toDto());
  }
}
