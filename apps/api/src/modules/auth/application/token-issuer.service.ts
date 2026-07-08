import { Inject, Injectable } from '@nestjs/common';
import type { AuthTokens } from '@bankbridge/contracts';
import type { User } from '../../users/domain/user.entity';
import {
  REFRESH_TOKEN_REPOSITORY,
  type RefreshTokenRepository,
} from '../domain/refresh-token-repository.port';
import {
  TOKEN_SERVICE,
  type JwtPayload,
  type TokenService,
} from '../domain/token-service.port';

/**
 * Single place that mints an access+refresh token pair and persists the
 * (hashed) refresh token. Reused by register, login, and refresh so token
 * issuance logic exists exactly once (DRY).
 */
@Injectable()
export class TokenIssuerService {
  constructor(
    @Inject(TOKEN_SERVICE) private readonly tokens: TokenService,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepository,
  ) {}

  async issueFor(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokens.signAccessToken(payload),
      this.tokens.signRefreshToken(payload),
    ]);

    const expiresAt = new Date(Date.now() + this.tokens.refreshTtlSeconds * 1000);
    await this.refreshTokens.save(
      user.id,
      this.tokens.hashToken(refreshToken),
      expiresAt,
    );

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.tokens.accessTtlSeconds,
    };
  }
}
