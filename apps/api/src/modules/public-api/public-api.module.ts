import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { ApiKeyGuard } from './interface/guards/api-key.guard';
import { ApiKeyScopesGuard } from './interface/guards/api-key-scopes.guard';
import { PublicAccountsController } from './interface/public-accounts.controller';
import { PublicTransactionsController } from './interface/public-transactions.controller';

/**
 * Public API: third-party apps authenticate with API keys and access consented
 * customer data. Double gate — API key scopes AND user→application consent
 * must both allow the requested operation.
 */
@Module({
  imports: [ApiKeysModule, AccountsModule, TransactionsModule],
  controllers: [PublicAccountsController, PublicTransactionsController],
  providers: [ApiKeyGuard, ApiKeyScopesGuard],
})
export class PublicApiModule {}
