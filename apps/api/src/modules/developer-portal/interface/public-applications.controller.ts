import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/interface/decorators/public.decorator';
import {
  ListPublicApplicationsUseCase,
  type PublicApplication,
} from '../application/list-public-applications.use-case';

@ApiTags('Developer Portal')
@Controller({ path: 'applications', version: '1' })
export class PublicApplicationsController {
  constructor(private readonly listPublic: ListPublicApplicationsUseCase) {}

  @Public()
  @Get('catalog')
  @ApiOperation({ summary: 'List active applications (for consent grant UI)' })
  catalog(): Promise<PublicApplication[]> {
    return this.listPublic.execute();
  }
}
