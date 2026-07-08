import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditAction } from '../../audit-logs/domain/audit-actions';
import { AuditLogService } from '../../audit-logs/application/audit-log.service';
import { NotificationService } from '../../notifications/application/notification.service';
import {
  CONSENT_REPOSITORY,
  type ConsentRepository,
} from '../domain/consent-repository.port';

@Injectable()
export class RevokeConsentUseCase {
  constructor(
    @Inject(CONSENT_REPOSITORY) private readonly consents: ConsentRepository,
    private readonly audit: AuditLogService,
    private readonly notifications: NotificationService,
  ) {}

  async execute(userId: string, consentId: string): Promise<void> {
    const consent = await this.consents.findById(consentId);
    if (!consent) {
      throw new NotFoundException('Consent not found');
    }
    // A user may only revoke their own consent.
    if (consent.userId !== userId) {
      throw new ForbiddenException('You cannot revoke this consent');
    }
    const dto = consent.toDto();
    await this.consents.revoke(consentId);

    await Promise.all([
      this.audit.record({
        actorId: userId,
        action: AuditAction.CONSENT_REVOKE,
        resourceType: 'consent',
        resourceId: dto.id,
        metadata: { bankId: dto.bankId, applicationId: dto.applicationId },
      }),
      this.notifications.notifyConsentRevoked(
        userId,
        dto.applicationName,
        dto.bankName,
      ),
    ]);
  }
}
