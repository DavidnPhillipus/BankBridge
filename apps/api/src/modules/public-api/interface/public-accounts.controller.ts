import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import type { Account, AccountBalance } from '@bankbridge/contracts';
import { Public } from '../../auth/interface/decorators/public.decorator';
import { GetAccountBalanceUseCase } from '../../accounts/application/get-account-balance.use-case';
import { GetAccountUseCase } from '../../accounts/application/get-account.use-case';
import { SyncAccountsUseCase } from '../../accounts/application/sync-accounts.use-case';
import { ApiKeyScopes } from './decorators/api-key-scopes.decorator';
import { CurrentApiKey } from './decorators/current-api-key.decorator';
import type { AuthenticatedApiKey } from '../../api-keys/domain/authenticated-api-key';
import { CustomerId } from './decorators/customer-id.decorator';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ApiKeyScopesGuard } from './guards/api-key-scopes.guard';

@ApiTags('Public API')
@ApiSecurity('api-key')
@Public()
@UseGuards(ApiKeyGuard, ApiKeyScopesGuard)
@Controller({ path: 'public/accounts', version: '1' })
export class PublicAccountsController {
  constructor(
    private readonly syncAccounts: SyncAccountsUseCase,
    private readonly getAccount: GetAccountUseCase,
    private readonly getBalance: GetAccountBalanceUseCase,
  ) {}

  @Get()
  @ApiKeyScopes('ACCOUNTS_READ')
  @ApiOperation({
    summary: 'List accounts for a customer (requires consent + API key scope)',
  })
  list(
    @CustomerId() customerId: string,
    @CurrentApiKey() apiKey: AuthenticatedApiKey,
  ): Promise<Account[]> {
    return this.syncAccounts.execute(customerId, false, apiKey.applicationId);
  }

  @Get(':id')
  @ApiKeyScopes('ACCOUNTS_READ')
  @ApiOperation({ summary: 'Get a single account for a customer' })
  detail(
    @CustomerId() customerId: string,
    @CurrentApiKey() apiKey: AuthenticatedApiKey,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Account> {
    return this.getAccount.execute(customerId, id, apiKey.applicationId);
  }

  @Get(':id/balance')
  @ApiKeyScopes('BALANCES_READ')
  @ApiOperation({ summary: 'Get a live balance for a customer account' })
  balance(
    @CustomerId() customerId: string,
    @CurrentApiKey() apiKey: AuthenticatedApiKey,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AccountBalance> {
    return this.getBalance.execute(customerId, id, apiKey.applicationId);
  }
}
