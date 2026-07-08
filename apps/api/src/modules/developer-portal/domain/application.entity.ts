import type {
  Application as ApplicationDto,
  AppEnvironment,
} from '@bankbridge/contracts';

export interface ApplicationProps {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  environment: AppEnvironment;
  redirectUris: string[];
  isActive: boolean;
  createdAt: Date;
}

/** A third-party developer application that consumes the public API. */
export class Application {
  constructor(private readonly props: ApplicationProps) {}

  get id(): string {
    return this.props.id;
  }
  get ownerId(): string {
    return this.props.ownerId;
  }
  get isActive(): boolean {
    return this.props.isActive;
  }

  toDto(): ApplicationDto {
    return {
      id: this.props.id,
      name: this.props.name,
      description: this.props.description,
      environment: this.props.environment,
      redirectUris: this.props.redirectUris,
      isActive: this.props.isActive,
      createdAt: this.props.createdAt.toISOString(),
    };
  }
}
