import { Injectable } from '@nestjs/common';
import { type AppEnvironment as PrismaAppEnvironment } from '@prisma/client';
import type { AppEnvironment } from '@bankbridge/contracts';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { Application } from '../domain/application.entity';
import type {
  ApplicationRepository,
  CreateApplicationData,
  UpdateApplicationData,
} from '../domain/application-repository.port';

type ApplicationRecord = {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  environment: PrismaAppEnvironment;
  redirectUris: string[];
  isActive: boolean;
  createdAt: Date;
};

@Injectable()
export class PrismaApplicationRepository implements ApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateApplicationData): Promise<Application> {
    const record = await this.prisma.application.create({
      data: {
        ownerId: data.ownerId,
        name: data.name,
        description: data.description,
        environment: data.environment as PrismaAppEnvironment,
        redirectUris: data.redirectUris,
      },
    });
    return this.toDomain(record);
  }

  async findByOwner(ownerId: string): Promise<Application[]> {
    const records = await this.prisma.application.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Application | null> {
    const record = await this.prisma.application.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findByIdForOwner(ownerId: string, id: string): Promise<Application | null> {
    const record = await this.prisma.application.findFirst({
      where: { id, ownerId },
    });
    return record ? this.toDomain(record) : null;
  }

  async update(id: string, data: UpdateApplicationData): Promise<Application> {
    const record = await this.prisma.application.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        redirectUris: data.redirectUris,
        isActive: data.isActive,
      },
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.application.delete({ where: { id } });
  }

  private toDomain(record: ApplicationRecord): Application {
    return new Application({
      id: record.id,
      ownerId: record.ownerId,
      name: record.name,
      description: record.description,
      environment: record.environment as AppEnvironment,
      redirectUris: record.redirectUris,
      isActive: record.isActive,
      createdAt: record.createdAt,
    });
  }
}
