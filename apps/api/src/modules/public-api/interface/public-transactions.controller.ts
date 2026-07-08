import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import type { TransactionPage } from '@bankbridge/contracts';
import { Public } from '../../auth/interface/decorators/public.decorator';
import { ListTransactionsUseCase } from '../../transactions/application/list-transactions.use-case';
import { TransactionQueryDto } from '../../transactions/interface/dto/transaction-query.dto';
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
export class PublicTransactionsController {
  constructor(private readonly listTransactions: ListTransactionsUseCase) {}

  @Get(':accountId/transactions')
  @ApiKeyScopes('TRANSACTIONS_READ')
  @ApiOperation({
    summary: 'List transactions for a customer account (paginated)',
  })
  list(
    @CustomerId() customerId: string,
    @CurrentApiKey() apiKey: AuthenticatedApiKey,
    @Param('accountId', ParseUUIDPipe) accountId: string,
    @Query() query: TransactionQueryDto,
  ): Promise<TransactionPage> {
    return this.listTransactions.execute(customerId, accountId, {
      page: query.page,
      pageSize: query.pageSize,
      since: query.since,
      applicationId: apiKey.applicationId,
    });
  }
}
