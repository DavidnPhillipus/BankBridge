import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction } from '../../audit-logs/domain/audit-actions';
import { AuditLogService } from '../../audit-logs/application/audit-log.service';
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
    private readonly audit: AuditLogService,
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

    await this.audit.record({
      actorId: ownerId,
      action: AuditAction.API_KEY_REVOKE,
      resourceType: 'api_key',
      resourceId: keyId,
      metadata: { applicationId: key.applicationId },
    });
  }
}
