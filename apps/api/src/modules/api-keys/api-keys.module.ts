import { Module } from '@nestjs/common';
import { DeveloperPortalModule } from '../developer-portal/developer-portal.module';
import { CreateApiKeyUseCase } from './application/create-api-key.use-case';
import { ListApiKeysUseCase } from './application/list-api-keys.use-case';
import { RevokeApiKeyUseCase } from './application/revoke-api-key.use-case';
import { API_KEY_REPOSITORY } from './domain/api-key-repository.port';
import { PrismaApiKeyRepository } from './infrastructure/prisma-api-key.repository';
import { ApiKeysController } from './interface/api-keys.controller';

/**
 * API Keys: issue / list / revoke keys for developer applications. Secrets are
 * shown once and stored only as a SHA-256 hash (with a public prefix for
 * lookup). Exports API_KEY_REPOSITORY for the public API auth guard (Step 14).
 */
@Module({
  imports: [DeveloperPortalModule],
  controllers: [ApiKeysController],
  providers: [
    CreateApiKeyUseCase,
    ListApiKeysUseCase,
    RevokeApiKeyUseCase,
    { provide: API_KEY_REPOSITORY, useClass: PrismaApiKeyRepository },
  ],
  exports: [API_KEY_REPOSITORY],
})
export class ApiKeysModule {}
