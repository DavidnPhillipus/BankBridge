import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Consent as ConsentDto, CreateConsentInput } from '@bankbridge/contracts';
import { AuditAction } from '../../audit-logs/domain/audit-actions';
import { AuditLogService } from '../../audit-logs/application/audit-log.service';
import { NotificationService } from '../../notifications/application/notification.service';
import {
  CONSENT_REPOSITORY,
  type ConsentRepository,
} from '../domain/consent-repository.port';

const DEFAULT_DURATION_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class GrantConsentUseCase {
  constructor(
    @Inject(CONSENT_REPOSITORY) private readonly consents: ConsentRepository,
    private readonly audit: AuditLogService,
    private readonly notifications: NotificationService,
  ) {}

  async execute(userId: string, input: CreateConsentInput): Promise<ConsentDto> {
    const [bank, application] = await Promise.all([
      this.consents.getBankRef(input.bankId),
      this.consents.getApplicationRef(input.applicationId),
    ]);

    if (!bank || !bank.isActive) {
      throw new NotFoundException('Bank not found or inactive');
    }
    if (!application || !application.isActive) {
      throw new NotFoundException('Application not found or inactive');
    }
    if (input.scopes.length === 0) {
      throw new BadRequestException('At least one scope is required');
    }

    // Prevent duplicate active consent for the same user+bank+app.
    const existing = await this.consents.findEffectiveByUserBank(userId, input.bankId);
    if (existing && existing.applicationId === input.applicationId) {
      throw new ConflictException(
        'An active consent already exists for this application and bank',
      );
    }

    const durationDays = input.durationDays ?? DEFAULT_DURATION_DAYS;
    const expiresAt = new Date(Date.now() + durationDays * DAY_MS);

    const consent = await this.consents.create({
      userId,
      applicationId: input.applicationId,
      bankId: input.bankId,
      scopes: input.scopes,
      expiresAt,
    });

    const dto = consent.toDto();
    await Promise.all([
      this.audit.record({
        actorId: userId,
        action: AuditAction.CONSENT_GRANT,
        resourceType: 'consent',
        resourceId: dto.id,
        metadata: {
          bankId: dto.bankId,
          applicationId: dto.applicationId,
          scopes: dto.scopes,
        },
      }),
      this.notifications.notifyConsentGranted(
        userId,
        dto.applicationName,
        dto.bankName,
      ),
    ]);

    return dto;
  }
}
