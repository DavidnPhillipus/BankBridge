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
import type { Consent } from '@bankbridge/contracts';
import { CurrentUser } from '../../auth/interface/decorators/current-user.decorator';
import { Roles } from '../../auth/interface/decorators/roles.decorator';
import { GrantConsentUseCase } from '../application/grant-consent.use-case';
import { ListConsentsUseCase } from '../application/list-consents.use-case';
import { RevokeConsentUseCase } from '../application/revoke-consent.use-case';
import { CreateConsentDto, ListConsentsQueryDto } from './dto/consent.dto';

@ApiTags('Consent')
@ApiBearerAuth()
@Roles('CUSTOMER')
@Controller({ path: 'consents', version: '1' })
export class ConsentController {
  constructor(
    private readonly grantConsent: GrantConsentUseCase,
    private readonly revokeConsent: RevokeConsentUseCase,
    private readonly listConsents: ListConsentsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Grant consent for an application to access a bank' })
  grant(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateConsentDto,
  ): Promise<Consent> {
    return this.grantConsent.execute(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List consents (active permissions) for the user' })
  list(
    @CurrentUser('id') userId: string,
    @Query() query: ListConsentsQueryDto,
  ): Promise<Consent[]> {
    return this.listConsents.execute(userId, query.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke a consent' })
  async revoke(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.revokeConsent.execute(userId, id);
  }
}
