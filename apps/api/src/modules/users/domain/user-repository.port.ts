import type { UserRole } from '@bankbridge/contracts';
import type { User } from './user.entity';

/** DI token for the user repository port (Dependency Inversion). */
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface CreateUserData {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

/**
 * Port describing persistence operations for users. Implemented by
 * infrastructure (Prisma) so the application layer stays storage-agnostic.
 */
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
}
