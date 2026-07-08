import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './domain/user-repository.port';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository';

/**
 * Users: profiles and roles (CUSTOMER / DEVELOPER / ADMIN).
 * Binds the UserRepository port to its Prisma implementation and exports it so
 * other modules (auth) depend on the interface, not the concrete class.
 */
@Module({
  providers: [{ provide: USER_REPOSITORY, useClass: PrismaUserRepository }],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
