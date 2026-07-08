import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Bank } from '@bankbridge/contracts';
import { Public } from '../../auth/interface/decorators/public.decorator';
import { ListBanksUseCase } from '../application/list-banks.use-case';

@ApiTags('Banks')
@Controller({ path: 'banks', version: '1' })
export class BanksController {
  constructor(private readonly listBanks: ListBanksUseCase) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List supported banks' })
  list(): Promise<Bank[]> {
    return this.listBanks.execute();
  }
}
