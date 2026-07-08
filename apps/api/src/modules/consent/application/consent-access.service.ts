import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import type { ConsentScope } from '@bankbridge/contracts';
import {
  CONSENT_REPOSITORY,
  type ConsentRepository,
} from '../domain/consent-repository.port';

export interface ConsentedBank {
  bankId: string;
  adapterKey: string;
  bankName: string;
  scopes: ConsentScope[];
}

/**
 * The gate in front of the API Gateway. Other modules (accounts, transactions,
 * analytics) ask this service which banks a user has authorized, and assert a
 * required scope before any bank data is fetched. No effective consent => no data.
 */
@Injectable()
export class ConsentAccessService {
  constructor(
    @Inject(CONSENT_REPOSITORY) private readonly consents: ConsentRepository,
  ) {}

  /** Banks the user currently has effective consent for (optionally scoped). */
  async getConsentedBanks(
    userId: string,
    requiredScope?: ConsentScope,
  ): Promise<ConsentedBank[]> {
    const consents = await this.consents.findActiveByUser(userId);
    return consents
      .filter((c) => c.isEffective() && (!requiredScope || c.hasScope(requiredScope)))
      .map((c) => ({
        bankId: c.bankId,
        adapterKey: c.adapterKey,
        bankName: c.bankName,
        scopes: c.scopes,
      }));
  }

  /**
   * Ensures the user has an effective consent for a bank with the given scope.
   * Returns the resolved bank context, or throws 403.
   */
  async assertBankScope(
    userId: string,
    bankId: string,
    scope: ConsentScope,
  ): Promise<ConsentedBank> {
    const consent = await this.consents.findEffectiveByUserBank(userId, bankId);
    if (!consent || !consent.isEffective() || !consent.hasScope(scope)) {
      throw new ForbiddenException(
        `No active consent granting "${scope}" for this bank`,
      );
    }
    return {
      bankId: consent.bankId,
      adapterKey: consent.adapterKey,
      bankName: consent.bankName,
      scopes: consent.scopes,
    };
  }
}
