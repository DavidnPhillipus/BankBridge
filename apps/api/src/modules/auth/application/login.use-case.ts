import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { AuthResponse, LoginInput } from '@bankbridge/contracts';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../users/domain/user-repository.port';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '../domain/password-hasher.port';
import { TokenIssuerService } from './token-issuer.service';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
    private readonly tokenIssuer: TokenIssuerService,
  ) {}

  async execute(input: LoginInput): Promise<AuthResponse> {
    const email = input.email.toLowerCase().trim();
    const user = await this.users.findByEmail(email);

    // Uniform error + always run a compare-shaped path to reduce user
    // enumeration / timing signals.
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await this.hasher.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.tokenIssuer.issueFor(user);
    return { user: user.toAuthUser(), tokens };
  }
}
