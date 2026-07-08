import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { AuthResponse, RefreshInput } from '@bankbridge/contracts';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../users/domain/user-repository.port';
import {
  REFRESH_TOKEN_REPOSITORY,
  type RefreshTokenRepository,
} from '../domain/refresh-token-repository.port';
import {
  TOKEN_SERVICE,
  type TokenService,
} from '../domain/token-service.port';
import { TokenIssuerService } from './token-issuer.service';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(TOKEN_SERVICE) private readonly tokens: TokenService,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepository,
    private readonly tokenIssuer: TokenIssuerService,
  ) {}

  async execute(input: RefreshInput): Promise<AuthResponse> {
    // 1) Signature/expiry check on the JWT itself.
    let payload;
    try {
      payload = await this.tokens.verifyRefreshToken(input.refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 2) Confirm the token exists server-side and is neither revoked nor expired.
    const hash = this.tokens.hashToken(input.refreshToken);
    const stored = await this.refreshTokens.findByHash(hash);
    if (!stored || stored.revokedAt || stored.expiresAt.getTime() < Date.now()) {
      // Reuse of a revoked/unknown token => revoke the whole family defensively.
      if (stored?.userId) {
        await this.refreshTokens.revokeAllForUser(stored.userId);
      }
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 3) Rotation: invalidate the presented token before issuing a new pair.
    await this.refreshTokens.revokeByHash(hash);

    const user = await this.users.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.tokenIssuer.issueFor(user);
    return { user: user.toAuthUser(), tokens };
  }
}
