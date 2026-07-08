import { SetMetadata } from '@nestjs/common';
import type { ConsentScope } from '@bankbridge/contracts';

export const API_KEY_SCOPES_KEY = 'apiKeyScopes';

/** Required scopes on the API key for a public route (enforced by ApiKeyScopesGuard). */
export const ApiKeyScopes = (
  ...scopes: ConsentScope[]
): MethodDecorator & ClassDecorator => SetMetadata(API_KEY_SCOPES_KEY, scopes);
