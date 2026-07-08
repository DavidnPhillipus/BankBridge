import type {
  ApiKey as ApiKeyDto,
  AppEnvironment,
  ConsentScope,
} from '@bankbridge/contracts';

export interface ApiKeyProps {
  id: string;
  applicationId: string;
  name: string;
  keyPrefix: string;
  scopes: ConsentScope[];
  environment: AppEnvironment;
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
}

/** An API key's metadata. The secret is never held here after creation. */
export class ApiKey {
  constructor(private readonly props: ApiKeyProps) {}

  get id(): string {
    return this.props.id;
  }
  get scopes(): ConsentScope[] {
    return this.props.scopes;
  }
  get applicationId(): string {
    return this.props.applicationId;
  }

  isUsable(now: Date = new Date()): boolean {
    if (this.props.revokedAt) return false;
    if (this.props.expiresAt && this.props.expiresAt.getTime() <= now.getTime()) {
      return false;
    }
    return true;
  }

  toDto(): ApiKeyDto {
    return {
      id: this.props.id,
      applicationId: this.props.applicationId,
      name: this.props.name,
      keyPrefix: this.props.keyPrefix,
      scopes: this.props.scopes,
      environment: this.props.environment,
      lastUsedAt: this.props.lastUsedAt?.toISOString() ?? null,
      expiresAt: this.props.expiresAt?.toISOString() ?? null,
      revokedAt: this.props.revokedAt?.toISOString() ?? null,
      createdAt: this.props.createdAt.toISOString(),
    };
  }
}
