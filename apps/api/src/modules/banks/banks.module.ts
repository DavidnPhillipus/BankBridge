import { Module } from '@nestjs/common';
import { ListBanksUseCase } from './application/list-banks.use-case';
import { BanksController } from './interface/banks.controller';

@Module({
  controllers: [BanksController],
  providers: [ListBanksUseCase],
})
export class BanksModule {}
