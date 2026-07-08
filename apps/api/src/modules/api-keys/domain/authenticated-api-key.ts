import type { AppEnvironment, ConsentScope } from '@bankbridge/contracts';

/** Resolved API key context attached to public API requests after auth. */
export interface AuthenticatedApiKey {
  id: string;
  applicationId: string;
  applicationName: string;
  scopes: ConsentScope[];
  environment: AppEnvironment;
}
