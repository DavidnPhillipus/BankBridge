import { Inject, Injectable } from '@nestjs/common';
import {
  REFRESH_TOKEN_REPOSITORY,
  type RefreshTokenRepository,
} from '../domain/refresh-token-repository.port';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepository,
  ) {}

  /** Revokes every active refresh token for the user (all devices). */
  async execute(userId: string): Promise<void> {
    await this.refreshTokens.revokeAllForUser(userId);
  }
}
