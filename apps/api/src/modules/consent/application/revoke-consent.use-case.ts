import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CONSENT_REPOSITORY,
  type ConsentRepository,
} from '../domain/consent-repository.port';

@Injectable()
export class RevokeConsentUseCase {
  constructor(
    @Inject(CONSENT_REPOSITORY) private readonly consents: ConsentRepository,
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
    await this.consents.revoke(consentId);
  }
}
