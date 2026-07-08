import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { ApiGatewayModule } from '../api-gateway/api-gateway.module';
import { ConsentModule } from '../consent/consent.module';
import { ListTransactionsUseCase } from './application/list-transactions.use-case';
import { TransactionSyncService } from './application/transaction-sync.service';
import { TRANSACTION_REPOSITORY } from './domain/transaction-repository.port';
import { PrismaTransactionRepository } from './infrastructure/prisma-transaction.repository';
import { TransactionsController } from './interface/transactions.controller';

/**
 * Transactions: consent-gated (TRANSACTIONS_READ) read-through of an account's
 * transactions via the API Gateway, persisted with merchant + category
 * resolution so the analytics module can aggregate by category.
 */
@Module({
  imports: [ConsentModule, ApiGatewayModule, AccountsModule],
  controllers: [TransactionsController],
  providers: [
    TransactionSyncService,
    ListTransactionsUseCase,
    { provide: TRANSACTION_REPOSITORY, useClass: PrismaTransactionRepository },
  ],
  exports: [TRANSACTION_REPOSITORY, TransactionSyncService],
})
export class TransactionsModule {}
