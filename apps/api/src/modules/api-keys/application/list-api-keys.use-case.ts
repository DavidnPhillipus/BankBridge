import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ApiKey as ApiKeyDto } from '@bankbridge/contracts';
import {
  APPLICATION_REPOSITORY,
  type ApplicationRepository,
} from '../../developer-portal/domain/application-repository.port';
import {
  API_KEY_REPOSITORY,
  type ApiKeyRepository,
} from '../domain/api-key-repository.port';

@Injectable()
export class ListApiKeysUseCase {
  constructor(
    @Inject(API_KEY_REPOSITORY) private readonly apiKeys: ApiKeyRepository,
    @Inject(APPLICATION_REPOSITORY)
    private readonly applications: ApplicationRepository,
  ) {}

  async execute(ownerId: string, applicationId: string): Promise<ApiKeyDto[]> {
    const application = await this.applications.findByIdForOwner(
      ownerId,
      applicationId,
    );
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    const keys = await this.apiKeys.findByApplication(applicationId);
    return keys.map((k) => k.toDto());
  }
}
