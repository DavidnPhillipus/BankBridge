import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Application } from '@bankbridge/contracts';
import { CurrentUser } from '../../auth/interface/decorators/current-user.decorator';
import { Roles } from '../../auth/interface/decorators/roles.decorator';
import { CreateApplicationUseCase } from '../application/create-application.use-case';
import { DeleteApplicationUseCase } from '../application/delete-application.use-case';
import { GetApplicationUseCase } from '../application/get-application.use-case';
import { ListApplicationsUseCase } from '../application/list-applications.use-case';
import { UpdateApplicationUseCase } from '../application/update-application.use-case';
import { CreateApplicationDto, UpdateApplicationDto } from './dto/application.dto';

@ApiTags('Developer Portal')
@ApiBearerAuth()
@Roles('DEVELOPER', 'ADMIN')
@Controller({ path: 'applications', version: '1' })
export class ApplicationsController {
  constructor(
    private readonly createApplication: CreateApplicationUseCase,
    private readonly listApplications: ListApplicationsUseCase,
    private readonly getApplication: GetApplicationUseCase,
    private readonly updateApplication: UpdateApplicationUseCase,
    private readonly deleteApplication: DeleteApplicationUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new application' })
  create(
    @CurrentUser('id') ownerId: string,
    @Body() dto: CreateApplicationDto,
  ): Promise<Application> {
    return this.createApplication.execute(ownerId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List your applications' })
  list(@CurrentUser('id') ownerId: string): Promise<Application[]> {
    return this.listApplications.execute(ownerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one of your applications' })
  detail(
    @CurrentUser('id') ownerId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Application> {
    return this.getApplication.execute(ownerId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an application' })
  update(
    @CurrentUser('id') ownerId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateApplicationDto,
  ): Promise<Application> {
    return this.updateApplication.execute(ownerId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an application' })
  async remove(
    @CurrentUser('id') ownerId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.deleteApplication.execute(ownerId, id);
  }
}
