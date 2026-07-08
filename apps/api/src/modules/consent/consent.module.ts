import { Module } from '@nestjs/common';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ConsentAccessService } from './application/consent-access.service';
import { GrantConsentUseCase } from './application/grant-consent.use-case';
import { ListConsentsUseCase } from './application/list-consents.use-case';
import { RevokeConsentUseCase } from './application/revoke-consent.use-case';
import { CONSENT_REPOSITORY } from './domain/consent-repository.port';
import { PrismaConsentRepository } from './infrastructure/prisma-consent.repository';
import { ConsentController } from './interface/consent.controller';

/**
 * Consent Management: grant / revoke / list, plus ConsentAccessService — the
 * gate the accounts, transactions, and analytics modules use to ensure no bank
 * data is ever fetched without an effective consent + the required scope.
 */
@Module({
  imports: [AuditLogsModule, NotificationsModule],
  controllers: [ConsentController],
  providers: [
    GrantConsentUseCase,
    RevokeConsentUseCase,
    ListConsentsUseCase,
    ConsentAccessService,
    { provide: CONSENT_REPOSITORY, useClass: PrismaConsentRepository },
  ],
  exports: [ConsentAccessService],
})
export class ConsentModule {}
