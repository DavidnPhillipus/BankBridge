import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { TransactionPage } from '@bankbridge/contracts';
import { CurrentUser } from '../../auth/interface/decorators/current-user.decorator';
import { Roles } from '../../auth/interface/decorators/roles.decorator';
import { ListTransactionsUseCase } from '../application/list-transactions.use-case';
import { TransactionQueryDto } from './dto/transaction-query.dto';

@ApiTags('Transactions')
@ApiBearerAuth()
@Roles('CUSTOMER')
@Controller({ path: 'accounts', version: '1' })
export class TransactionsController {
  constructor(private readonly listTransactions: ListTransactionsUseCase) {}

  @Get(':accountId/transactions')
  @ApiOperation({ summary: 'List transactions for an account (paginated)' })
  list(
    @CurrentUser('id') userId: string,
    @Param('accountId', ParseUUIDPipe) accountId: string,
    @Query() query: TransactionQueryDto,
  ): Promise<TransactionPage> {
    return this.listTransactions.execute(userId, accountId, {
      page: query.page,
      pageSize: query.pageSize,
      since: query.since,
    });
  }

  @Post(':accountId/transactions/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Force a live refresh of an account’s transactions' })
  sync(
    @CurrentUser('id') userId: string,
    @Param('accountId', ParseUUIDPipe) accountId: string,
    @Query() query: TransactionQueryDto,
  ): Promise<TransactionPage> {
    return this.listTransactions.execute(userId, accountId, {
      page: query.page,
      pageSize: query.pageSize,
      since: query.since,
      force: true,
    });
  }
}
