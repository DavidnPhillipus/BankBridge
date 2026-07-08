import type { Consent as ConsentDto, ConsentScope, ConsentStatus } from '@bankbridge/contracts';

export interface ConsentProps {
  id: string;
  userId: string;
  applicationId: string;
  applicationName: string;
  bankId: string;
  bankName: string;
  adapterKey: string;
  status: ConsentStatus;
  scopes: ConsentScope[];
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

/**
 * Consent domain entity — the record of a customer authorizing an application
 * to access specific data (scopes) at a specific bank, for a limited time.
 */
export class Consent {
  constructor(private readonly props: ConsentProps) {}

  get id(): string {
    return this.props.id;
  }
  get userId(): string {
    return this.props.userId;
  }
  get applicationId(): string {
    return this.props.applicationId;
  }
  get bankId(): string {
    return this.props.bankId;
  }
  get bankName(): string {
    return this.props.bankName;
  }
  get adapterKey(): string {
    return this.props.adapterKey;
  }
  get scopes(): ConsentScope[] {
    return this.props.scopes;
  }

  /** True only if ACTIVE, not revoked, and not past expiry. */
  isEffective(now: Date = new Date()): boolean {
    return (
      this.props.status === 'ACTIVE' &&
      !this.props.revokedAt &&
      this.props.expiresAt.getTime() > now.getTime()
    );
  }

  hasScope(scope: ConsentScope): boolean {
    return this.props.scopes.includes(scope);
  }

  /** Effective status, downgrading ACTIVE→EXPIRED when past expiry. */
  effectiveStatus(now: Date = new Date()): ConsentStatus {
    if (this.props.status === 'ACTIVE' && this.props.expiresAt.getTime() <= now.getTime()) {
      return 'EXPIRED';
    }
    return this.props.status;
  }

  toDto(): ConsentDto {
    return {
      id: this.props.id,
      userId: this.props.userId,
      applicationId: this.props.applicationId,
      applicationName: this.props.applicationName,
      bankId: this.props.bankId,
      bankName: this.props.bankName,
      status: this.effectiveStatus(),
      scopes: this.props.scopes,
      expiresAt: this.props.expiresAt.toISOString(),
      createdAt: this.props.createdAt.toISOString(),
    };
  }
}
