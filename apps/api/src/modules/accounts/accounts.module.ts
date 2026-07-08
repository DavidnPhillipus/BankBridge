import { Module } from '@nestjs/common';
import { ApiGatewayModule } from '../api-gateway/api-gateway.module';
import { ConsentModule } from '../consent/consent.module';
import { GetAccountBalanceUseCase } from './application/get-account-balance.use-case';
import { GetAccountUseCase } from './application/get-account.use-case';
import { SyncAccountsUseCase } from './application/sync-accounts.use-case';
import { ACCOUNT_REPOSITORY } from './domain/account-repository.port';
import { PrismaAccountRepository } from './infrastructure/prisma-account.repository';
import { AccountsController } from './interface/accounts.controller';

/**
 * Accounts: read-through aggregation of a customer's accounts across every
 * consented bank. Consent (ConsentModule) gates access; the API Gateway
 * (ApiGatewayModule) normalizes each bank's dialect before persistence.
 */
@Module({
  imports: [ConsentModule, ApiGatewayModule],
  controllers: [AccountsController],
  providers: [
    SyncAccountsUseCase,
    GetAccountUseCase,
    GetAccountBalanceUseCase,
    { provide: ACCOUNT_REPOSITORY, useClass: PrismaAccountRepository },
  ],
  exports: [ACCOUNT_REPOSITORY, SyncAccountsUseCase],
})
export class AccountsModule {}
