import { Injectable } from '@nestjs/common';
import type { Role as PrismaRole, User as PrismaUser } from '@prisma/client';
import type { UserRole } from '@bankbridge/contracts';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { User } from '../domain/user.entity';
import type {
  CreateUserData,
  UserRepository,
} from '../domain/user-repository.port';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    return record ? this.toDomain(record) : null;
  }

  async create(data: CreateUserData): Promise<User> {
    const record = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role as PrismaRole,
      },
    });
    return this.toDomain(record);
  }

  /** Maps the Prisma record to the domain entity (Anti-Corruption boundary). */
  private toDomain(record: PrismaUser): User {
    return new User({
      id: record.id,
      email: record.email,
      passwordHash: record.passwordHash,
      firstName: record.firstName,
      lastName: record.lastName,
      role: record.role as UserRole,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
