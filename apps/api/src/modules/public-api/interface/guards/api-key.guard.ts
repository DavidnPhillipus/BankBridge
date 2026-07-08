import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKeyAuthService } from '../../../api-keys/application/api-key-auth.service';
import type { AuthenticatedApiKey } from '../../../api-keys/domain/authenticated-api-key';

type ApiKeyRequest = {
  headers: Record<string, string | string[] | undefined>;
  apiKey?: AuthenticatedApiKey;
};

/**
 * Authenticates third-party apps via API key. Accepts:
 * - Authorization: Bearer bbk_<prefix>.<secret>
 * - X-API-Key: bbk_<prefix>.<secret>
 *
 * Public routes use @Public() to bypass JWT, then apply this guard locally.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyAuth: ApiKeyAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ApiKeyRequest>();
    const rawKey = this.extractKey(request);
    if (!rawKey) {
      throw new UnauthorizedException('API key required');
    }

    request.apiKey = await this.apiKeyAuth.authenticate(rawKey);
    return true;
  }

  private extractKey(request: ApiKeyRequest): string | null {
    const auth = request.headers.authorization;
    if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
      return auth.slice('Bearer '.length).trim();
    }
    const header = request.headers['x-api-key'];
    if (typeof header === 'string') return header.trim();
    return null;
  }
}
