import { Injectable } from '@nestjs/common';
import {
  type CategoryType as PrismaCategoryType,
  type Prisma,
  type TransactionStatus as PrismaTransactionStatus,
  type TransactionType as PrismaTransactionType,
} from '@prisma/client';
import type {
  Category,
  CategoryType,
  Merchant,
  TransactionStatus,
  TransactionType,
} from '@bankbridge/contracts';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import type { NormalizedTransaction } from '../../api-gateway/domain/normalized-models';
import { Transaction } from '../domain/transaction.entity';
import type {
  TransactionPageQuery,
  TransactionPageResult,
  TransactionRepository,
} from '../domain/transaction-repository.port';

const txnInclude = {
  merchant: true,
  category: true,
} satisfies Prisma.TransactionInclude;

type TxnRecord = Prisma.TransactionGetPayload<{ include: typeof txnInclude }>;

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertMany(
    accountId: string,
    transactions: NormalizedTransaction[],
  ): Promise<number> {
    if (transactions.length === 0) return 0;

    // Resolve categories once (they are a fixed, seeded set).
    const categories = await this.prisma.category.findMany();
    const categoryIdByName = new Map(categories.map((c) => [c.name, c.id]));

    // Cache merchant ids resolved during this sync to avoid repeat upserts.
    const merchantIdByName = new Map<string, string>();

    let written = 0;
    for (const txn of transactions) {
      const categoryId = txn.categoryName
        ? (categoryIdByName.get(txn.categoryName) ?? null)
        : null;

      const merchantId = await this.resolveMerchantId(
        txn.merchantName,
        categoryId,
        merchantIdByName,
      );

      await this.prisma.transaction.upsert({
        where: {
          accountId_externalId: { accountId, externalId: txn.externalId },
        },
        create: {
          accountId,
          externalId: txn.externalId,
          amount: txn.amount,
          currency: txn.currency,
          type: txn.type as PrismaTransactionType,
          status: txn.status as PrismaTransactionStatus,
          description: txn.description,
          merchantId,
          categoryId,
          bookedAt: txn.bookedAt,
        },
        update: {
          amount: txn.amount,
          status: txn.status as PrismaTransactionStatus,
          description: txn.description,
          merchantId,
          categoryId,
        },
      });
      written += 1;
    }
    return written;
  }

  async findPageByAccount(
    accountId: string,
    query: TransactionPageQuery,
  ): Promise<TransactionPageResult> {
    const where: Prisma.TransactionWhereInput = {
      accountId,
      ...(query.since ? { bookedAt: { gte: query.since } } : {}),
    };

    const [records, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        include: txnInclude,
        orderBy: { bookedAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return { data: records.map((r) => this.toDomain(r)), total };
  }

  private async resolveMerchantId(
    name: string | null,
    categoryId: string | null,
    cache: Map<string, string>,
  ): Promise<string | null> {
    if (!name) return null;
    const cached = cache.get(name);
    if (cached) return cached;

    // Merchant.name is unique; create on first sighting with a best-guess category.
    const merchant = await this.prisma.merchant.upsert({
      where: { name },
      update: {},
      create: { name, categoryId },
    });
    cache.set(name, merchant.id);
    return merchant.id;
  }

  private toDomain(record: TxnRecord): Transaction {
    return new Transaction({
      id: record.id,
      accountId: record.accountId,
      externalId: record.externalId,
      amount: Number(record.amount),
      currency: record.currency,
      type: record.type as TransactionType,
      status: record.status as TransactionStatus,
      description: record.description,
      merchant: record.merchant ? this.toMerchant(record.merchant) : null,
      category: record.category ? this.toCategory(record.category) : null,
      bookedAt: record.bookedAt,
    });
  }

  private toMerchant(m: TxnRecord['merchant']): Merchant | null {
    if (!m) return null;
    return { id: m.id, name: m.name, logoUrl: m.logoUrl };
  }

  private toCategory(c: NonNullable<TxnRecord['category']>): Category {
    return {
      id: c.id,
      name: c.name,
      type: this.toCategoryType(c.type),
      icon: c.icon,
      color: c.color,
    };
  }

  private toCategoryType(type: PrismaCategoryType): CategoryType {
    return type as CategoryType;
  }
}
