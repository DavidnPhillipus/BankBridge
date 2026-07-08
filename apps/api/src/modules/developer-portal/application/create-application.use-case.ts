import { Inject, Injectable } from '@nestjs/common';
import type { Application as ApplicationDto, CreateApplicationInput } from '@bankbridge/contracts';
import {
  APPLICATION_REPOSITORY,
  type ApplicationRepository,
} from '../domain/application-repository.port';

@Injectable()
export class CreateApplicationUseCase {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applications: ApplicationRepository,
  ) {}

  async execute(
    ownerId: string,
    input: CreateApplicationInput,
  ): Promise<ApplicationDto> {
    const application = await this.applications.create({
      ownerId,
      name: input.name,
      description: input.description,
      environment: input.environment,
      redirectUris: input.redirectUris,
    });
    return application.toDto();
  }
}
