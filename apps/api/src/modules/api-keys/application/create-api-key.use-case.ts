import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateApiKeyInput, CreatedApiKey } from '@bankbridge/contracts';
import {
  APPLICATION_REPOSITORY,
  type ApplicationRepository,
} from '../../developer-portal/domain/application-repository.port';
import {
  API_KEY_REPOSITORY,
  type ApiKeyRepository,
} from '../domain/api-key-repository.port';
import { KeyGenerator } from '../domain/key-generator';

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class CreateApiKeyUseCase {
  constructor(
    @Inject(API_KEY_REPOSITORY) private readonly apiKeys: ApiKeyRepository,
    @Inject(APPLICATION_REPOSITORY)
    private readonly applications: ApplicationRepository,
  ) {}

  async execute(ownerId: string, input: CreateApiKeyInput): Promise<CreatedApiKey> {
    const application = await this.applications.findByIdForOwner(
      ownerId,
      input.applicationId,
    );
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const generated = KeyGenerator.generate();
    const expiresAt = input.expiresInDays
      ? new Date(Date.now() + input.expiresInDays * DAY_MS)
      : null;

    const apiKey = await this.apiKeys.create({
      applicationId: input.applicationId,
      name: input.name,
      keyPrefix: generated.prefix,
      keyHash: generated.hash,
      scopes: input.scopes,
      environment: application.toDto().environment,
      expiresAt,
    });

    // The secret is returned exactly once and never persisted in plaintext.
    return { ...apiKey.toDto(), secret: generated.fullKey };
  }
}
