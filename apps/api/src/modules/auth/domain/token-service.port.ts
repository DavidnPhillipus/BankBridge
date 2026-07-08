import type { UserRole } from '@bankbridge/contracts';

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');

/** Claims embedded in issued JWTs. `sub` is the user id. */
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

/**
 * Port for JWT signing/verification + refresh-token hashing. The concrete
 * implementation (nestjs JwtService + node crypto) lives in infrastructure.
 */
export interface TokenService {
  signAccessToken(payload: JwtPayload): Promise<string>;
  signRefreshToken(payload: JwtPayload): Promise<string>;
  verifyRefreshToken(token: string): Promise<JwtPayload>;
  /** Deterministic hash (sha256) used to store/lookup refresh tokens. */
  hashToken(token: string): string;
  readonly accessTtlSeconds: number;
  readonly refreshTtlSeconds: number;
}
