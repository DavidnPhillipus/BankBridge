import { Inject, Injectable } from '@nestjs/common';
import type { Consent as ConsentDto, ConsentStatus } from '@bankbridge/contracts';
import {
  CONSENT_REPOSITORY,
  type ConsentRepository,
} from '../domain/consent-repository.port';

@Injectable()
export class ListConsentsUseCase {
  constructor(
    @Inject(CONSENT_REPOSITORY) private readonly consents: ConsentRepository,
  ) {}

  async execute(userId: string, status?: ConsentStatus): Promise<ConsentDto[]> {
    const consents = await this.consents.findManyByUser(userId, status);
    return consents.map((c) => c.toDto());
  }
}
