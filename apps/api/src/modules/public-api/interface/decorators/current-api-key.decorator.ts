import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AuthenticatedApiKey } from '../../../api-keys/domain/authenticated-api-key';

export const API_KEY_REQUEST_KEY = 'apiKey';

/** Extracts the authenticated API key context set by ApiKeyGuard. */
export const CurrentApiKey = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedApiKey => {
    const request = ctx.switchToHttp().getRequest<{ apiKey: AuthenticatedApiKey }>();
    return request.apiKey;
  },
);
