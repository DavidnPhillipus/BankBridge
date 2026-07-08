import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { AuthUser } from '@bankbridge/contracts';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../users/domain/user-repository.port';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(userId: string): Promise<AuthUser> {
    const user = await this.users.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }
    return user.toAuthUser();
  }
}
