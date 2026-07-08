import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';
import type { AnalyticsSnapshot, TransactionType } from '@bankbridge/contracts';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import type { AnalyticsRepository } from '../domain/analytics-repository.port';
import type { AnalyticsTxn, MonthlyAggregate } from '../domain/analytics.types';

@Injectable()
export class PrismaAnalyticsRepository implements AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTransactions(
    userId: string,
    bankIds: string[],
    from: Date,
    to: Date,
  ): Promise<AnalyticsTxn[]> {
    if (bankIds.length === 0) return [];

    const records = await this.prisma.transaction.findMany({
      where: {
        bookedAt: { gte: from, lte: to },
        account: { userId, bankId: { in: bankIds } },
      },
      select: {
        amount: true,
        type: true,
        bookedAt: true,
        category: { select: { name: true } },
        merchant: { select: { name: true } },
      },
    });

    return records.map((r) => ({
      amount: Number(r.amount),
      type: r.type as TransactionType,
      categoryName: r.category?.name ?? null,
      merchantName: r.merchant?.name ?? null,
      bookedAt: r.bookedAt,
    }));
  }

  async upsertSnapshot(
    userId: string,
    aggregate: MonthlyAggregate,
  ): Promise<AnalyticsSnapshot> {
    const byCategory = aggregate.byCategory as Prisma.InputJsonValue;
    const record = await this.prisma.analyticsSnapshot.upsert({
      where: { userId_period: { userId, period: aggregate.period } },
      create: {
        userId,
        period: aggregate.period,
        totalIncome: aggregate.totalIncome,
        totalExpense: aggregate.totalExpense,
        net: aggregate.net,
        byCategory,
      },
      update: {
        totalIncome: aggregate.totalIncome,
        totalExpense: aggregate.totalExpense,
        net: aggregate.net,
        byCategory,
      },
    });
    return this.toSnapshot(record);
  }

  async findSnapshots(userId: string, limit: number): Promise<AnalyticsSnapshot[]> {
    const records = await this.prisma.analyticsSnapshot.findMany({
      where: { userId },
      orderBy: { period: 'desc' },
      take: limit,
    });
    return records.map((r) => this.toSnapshot(r));
  }

  private toSnapshot(record: {
    id: string;
    period: string;
    totalIncome: Prisma.Decimal;
    totalExpense: Prisma.Decimal;
    net: Prisma.Decimal;
    byCategory: Prisma.JsonValue | null;
  }): AnalyticsSnapshot {
    return {
      id: record.id,
      period: record.period,
      totalIncome: Number(record.totalIncome),
      totalExpense: Number(record.totalExpense),
      net: Number(record.net),
      byCategory: (record.byCategory as Record<string, number> | null) ?? null,
    };
  }
}
