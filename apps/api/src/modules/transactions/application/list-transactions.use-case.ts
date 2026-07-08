import { Inject, Injectable } from '@nestjs/common';
import type { TransactionPage } from '@bankbridge/contracts';
import {
  TRANSACTION_REPOSITORY,
  type TransactionRepository,
} from '../domain/transaction-repository.port';
import { TransactionSyncService } from './transaction-sync.service';

export interface ListTransactionsInput {
  page: number;
  pageSize: number;
  since?: Date;
  force?: boolean;
}

@Injectable()
export class ListTransactionsUseCase {
  constructor(
    private readonly sync: TransactionSyncService,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactions: TransactionRepository,
  ) {}

  async execute(
    userId: string,
    accountId: string,
    input: ListTransactionsInput,
  ): Promise<TransactionPage> {
    // Read-through: ensure the latest transactions are persisted first. The sync
    // also performs the owner + consent (TRANSACTIONS_READ) checks.
    await this.sync.sync(userId, accountId, input.force ?? false);

    const { data, total } = await this.transactions.findPageByAccount(accountId, {
      page: input.page,
      pageSize: input.pageSize,
      since: input.since,
    });

    return {
      data: data.map((t) => t.toDto()),
      meta: {
        page: input.page,
        pageSize: input.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / input.pageSize)),
      },
    };
  }
}
