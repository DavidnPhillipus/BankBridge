import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { UserRole, type AuthResponse, type RegisterInput } from '@bankbridge/contracts';
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
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
    private readonly tokenIssuer: TokenIssuerService,
  ) {}

  async execute(input: RegisterInput): Promise<AuthResponse> {
    const email = input.email.toLowerCase().trim();

    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await this.hasher.hash(input.password);
    const user = await this.users.create({
      email,
      passwordHash,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      role: input.accountType ?? UserRole.CUSTOMER,
    });

    const tokens = await this.tokenIssuer.issueFor(user);
    return { user: user.toAuthUser(), tokens };
  }
}
