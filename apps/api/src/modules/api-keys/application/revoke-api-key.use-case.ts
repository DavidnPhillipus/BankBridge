import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  APPLICATION_REPOSITORY,
  type ApplicationRepository,
} from '../../developer-portal/domain/application-repository.port';
import {
  API_KEY_REPOSITORY,
  type ApiKeyRepository,
} from '../domain/api-key-repository.port';

@Injectable()
export class RevokeApiKeyUseCase {
  constructor(
    @Inject(API_KEY_REPOSITORY) private readonly apiKeys: ApiKeyRepository,
    @Inject(APPLICATION_REPOSITORY)
    private readonly applications: ApplicationRepository,
  ) {}

  async execute(ownerId: string, keyId: string): Promise<void> {
    const key = await this.apiKeys.findById(keyId);
    if (!key) {
      throw new NotFoundException('API key not found');
    }
    // Ensure the key belongs to an application this developer owns.
    const application = await this.applications.findByIdForOwner(
      ownerId,
      key.applicationId,
    );
    if (!application) {
      throw new NotFoundException('API key not found');
    }
    await this.apiKeys.revoke(keyId);
  }
}
