import { Injectable } from '@nestjs/common';
import {
  type AppEnvironment as PrismaAppEnvironment,
  type ConsentScope as PrismaConsentScope,
} from '@prisma/client';
import type { AppEnvironment, ConsentScope } from '@bankbridge/contracts';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { ApiKey } from '../domain/api-key.entity';
import type {
  ApiKeyRepository,
  CreateApiKeyData,
} from '../domain/api-key-repository.port';

type ApiKeyRecord = {
  id: string;
  applicationId: string;
  name: string;
  keyPrefix: string;
  scopes: PrismaConsentScope[];
  environment: PrismaAppEnvironment;
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
};

@Injectable()
export class PrismaApiKeyRepository implements ApiKeyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateApiKeyData): Promise<ApiKey> {
    const record = await this.prisma.apiKey.create({
      data: {
        applicationId: data.applicationId,
        name: data.name,
        keyPrefix: data.keyPrefix,
        keyHash: data.keyHash,
        scopes: data.scopes as PrismaConsentScope[],
        environment: data.environment as PrismaAppEnvironment,
        expiresAt: data.expiresAt,
      },
    });
    return this.toDomain(record);
  }

  async findByApplication(applicationId: string): Promise<ApiKey[]> {
    const records = await this.prisma.apiKey.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<ApiKey | null> {
    const record = await this.prisma.apiKey.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findByPrefix(keyPrefix: string): Promise<ApiKey | null> {
    const record = await this.prisma.apiKey.findUnique({ where: { keyPrefix } });
    return record ? this.toDomain(record) : null;
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.apiKey.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async touchLastUsed(id: string): Promise<void> {
    await this.prisma.apiKey.update({
      where: { id },
      data: { lastUsedAt: new Date() },
    });
  }

  private toDomain(record: ApiKeyRecord): ApiKey {
    return new ApiKey({
      id: record.id,
      applicationId: record.applicationId,
      name: record.name,
      keyPrefix: record.keyPrefix,
      scopes: record.scopes as ConsentScope[],
      environment: record.environment as AppEnvironment,
      lastUsedAt: record.lastUsedAt,
      expiresAt: record.expiresAt,
      revokedAt: record.revokedAt,
      createdAt: record.createdAt,
    });
  }
}
