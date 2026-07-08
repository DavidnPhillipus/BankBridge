import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { ApiKey, CreatedApiKey } from '@bankbridge/contracts';
import { CurrentUser } from '../../auth/interface/decorators/current-user.decorator';
import { Roles } from '../../auth/interface/decorators/roles.decorator';
import { CreateApiKeyUseCase } from '../application/create-api-key.use-case';
import { ListApiKeysUseCase } from '../application/list-api-keys.use-case';
import { RevokeApiKeyUseCase } from '../application/revoke-api-key.use-case';
import { CreateApiKeyDto, ListApiKeysQueryDto } from './dto/api-key.dto';

@ApiTags('API Keys')
@ApiBearerAuth()
@Roles('DEVELOPER', 'ADMIN')
@Controller({ path: 'api-keys', version: '1' })
export class ApiKeysController {
  constructor(
    private readonly createApiKey: CreateApiKeyUseCase,
    private readonly listApiKeys: ListApiKeysUseCase,
    private readonly revokeApiKey: RevokeApiKeyUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Issue a new API key (secret shown once)' })
  create(
    @CurrentUser('id') ownerId: string,
    @Body() dto: CreateApiKeyDto,
  ): Promise<CreatedApiKey> {
    return this.createApiKey.execute(ownerId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List API keys for an application' })
  list(
    @CurrentUser('id') ownerId: string,
    @Query() query: ListApiKeysQueryDto,
  ): Promise<ApiKey[]> {
    return this.listApiKeys.execute(ownerId, query.applicationId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke an API key' })
  async revoke(
    @CurrentUser('id') ownerId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.revokeApiKey.execute(ownerId, id);
  }
}
