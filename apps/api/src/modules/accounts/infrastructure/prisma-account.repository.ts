import { Injectable } from '@nestjs/common';
import { type AccountType as PrismaAccountType, type Prisma } from '@prisma/client';
import type { AccountType } from '@bankbridge/contracts';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import type { NormalizedAccount } from '../../api-gateway/domain/normalized-models';
import { Account } from '../domain/account.entity';
import type { AccountRepository } from '../domain/account-repository.port';

const accountInclude = {
  bank: { select: { name: true } },
} satisfies Prisma.AccountInclude;

type AccountRecord = Prisma.AccountGetPayload<{ include: typeof accountInclude }>;

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertFromGateway(
    userId: string,
    bankId: string,
    accounts: NormalizedAccount[],
  ): Promise<void> {
    await this.prisma.$transaction(
      accounts.map((a) =>
        this.prisma.account.upsert({
          where: { bankId_externalId: { bankId, externalId: a.externalId } },
          create: {
            userId,
            bankId,
            externalId: a.externalId,
            name: a.name,
            accountType: a.type as PrismaAccountType,
            mask: a.mask,
            currency: a.currency,
            balance: a.balance,
            availableBalance: a.available,
          },
          update: {
            name: a.name,
            accountType: a.type as PrismaAccountType,
            mask: a.mask,
            currency: a.currency,
            balance: a.balance,
            availableBalance: a.available,
          },
        }),
      ),
    );
  }

  async findManyByUser(userId: string, bankIds?: string[]): Promise<Account[]> {
    const records = await this.prisma.account.findMany({
      where: { userId, ...(bankIds ? { bankId: { in: bankIds } } : {}) },
      include: accountInclude,
      orderBy: [{ bank: { name: 'asc' } }, { name: 'asc' }],
    });
    return records.map((r) => this.toDomain(r));
  }

  async findByIdForUser(userId: string, accountId: string): Promise<Account | null> {
    const record = await this.prisma.account.findFirst({
      where: { id: accountId, userId },
      include: accountInclude,
    });
    return record ? this.toDomain(record) : null;
  }

  async updateBalance(
    accountId: string,
    balance: number,
    availableBalance: number,
  ): Promise<Account> {
    const record = await this.prisma.account.update({
      where: { id: accountId },
      data: { balance, availableBalance },
      include: accountInclude,
    });
    return this.toDomain(record);
  }

  private toDomain(record: AccountRecord): Account {
    return new Account({
      id: record.id,
      userId: record.userId,
      bankId: record.bankId,
      bankName: record.bank.name,
      externalId: record.externalId,
      name: record.name,
      accountType: record.accountType as AccountType,
      mask: record.mask,
      currency: record.currency,
      balance: Number(record.balance),
      availableBalance: Number(record.availableBalance),
    });
  }
}
