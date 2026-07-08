import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  APPLICATION_REPOSITORY,
  type ApplicationRepository,
} from '../../developer-portal/domain/application-repository.port';
import type { AuthenticatedApiKey } from '../domain/authenticated-api-key';
import {
  API_KEY_REPOSITORY,
  type ApiKeyRepository,
} from '../domain/api-key-repository.port';

@Injectable()
export class ApiKeyAuthService {
  constructor(
    @Inject(API_KEY_REPOSITORY) private readonly apiKeys: ApiKeyRepository,
    @Inject(APPLICATION_REPOSITORY)
    private readonly applications: ApplicationRepository,
  ) {}

  async authenticate(rawKey: string): Promise<AuthenticatedApiKey> {
    const key = await this.apiKeys.verifyPresentedKey(rawKey);
    if (!key) {
      throw new UnauthorizedException('Invalid API key');
    }

    const application = await this.applications.findById(key.applicationId);
    if (!application || !application.isActive) {
      throw new UnauthorizedException('Application is inactive');
    }

    await this.apiKeys.touchLastUsed(key.id);

    return {
      id: key.id,
      applicationId: key.applicationId,
      applicationName: application.toDto().name,
      scopes: key.scopes,
      environment: application.toDto().environment,
    };
  }
}
