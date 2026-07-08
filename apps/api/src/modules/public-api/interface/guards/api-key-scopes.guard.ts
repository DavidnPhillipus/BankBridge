import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { ConsentScope } from '@bankbridge/contracts';
import type { AuthenticatedApiKey } from '../../../api-keys/domain/authenticated-api-key';
import { API_KEY_SCOPES_KEY } from '../decorators/api-key-scopes.decorator';

/** Ensures the authenticated API key carries every scope required by the route. */
@Injectable()
export class ApiKeyScopesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<ConsentScope[]>(
      API_KEY_SCOPES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required || required.length === 0) return true;

    const { apiKey } = context
      .switchToHttp()
      .getRequest<{ apiKey?: AuthenticatedApiKey }>();

    if (!apiKey) {
      throw new ForbiddenException('API key context missing');
    }

    const missing = required.filter((scope) => !apiKey.scopes.includes(scope));
    if (missing.length > 0) {
      throw new ForbiddenException(
        `API key missing required scope(s): ${missing.join(', ')}`,
      );
    }
    return true;
  }
}
