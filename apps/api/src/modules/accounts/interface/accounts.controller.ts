import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Account, AccountBalance } from '@bankbridge/contracts';
import { CurrentUser } from '../../auth/interface/decorators/current-user.decorator';
import { GetAccountBalanceUseCase } from '../application/get-account-balance.use-case';
import { GetAccountUseCase } from '../application/get-account.use-case';
import { SyncAccountsUseCase } from '../application/sync-accounts.use-case';

@ApiTags('Accounts')
@ApiBearerAuth()
@Controller({ path: 'accounts', version: '1' })
export class AccountsController {
  constructor(
    private readonly syncAccounts: SyncAccountsUseCase,
    private readonly getAccount: GetAccountUseCase,
    private readonly getBalance: GetAccountBalanceUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List linked accounts across all consented banks' })
  list(@CurrentUser('id') userId: string): Promise<Account[]> {
    return this.syncAccounts.execute(userId, false);
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Force a live refresh of accounts from the banks' })
  sync(@CurrentUser('id') userId: string): Promise<Account[]> {
    return this.syncAccounts.execute(userId, true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single account' })
  detail(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Account> {
    return this.getAccount.execute(userId, id);
  }

  @Get(':id/balance')
  @ApiOperation({ summary: 'Get a live balance for an account' })
  balance(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AccountBalance> {
    return this.getBalance.execute(userId, id);
  }
}
