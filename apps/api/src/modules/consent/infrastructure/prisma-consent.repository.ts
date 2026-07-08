import { Injectable } from '@nestjs/common';
import { type Prisma, type ConsentStatus as PrismaConsentStatus } from '@prisma/client';
import type { ConsentScope, ConsentStatus } from '@bankbridge/contracts';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { Consent } from '../domain/consent.entity';
import type {
  ApplicationRef,
  BankRef,
  ConsentRepository,
  CreateConsentData,
} from '../domain/consent-repository.port';

const consentInclude = {
  application: { select: { name: true } },
  bank: { select: { name: true, adapterKey: true } },
} satisfies Prisma.ConsentInclude;

type ConsentRecord = Prisma.ConsentGetPayload<{ include: typeof consentInclude }>;

@Injectable()
export class PrismaConsentRepository implements ConsentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateConsentData): Promise<Consent> {
    const record = await this.prisma.consent.create({
      data: {
        userId: data.userId,
        applicationId: data.applicationId,
        bankId: data.bankId,
        scopes: data.scopes,
        status: 'ACTIVE',
        expiresAt: data.expiresAt,
      },
      include: consentInclude,
    });
    return this.toDomain(record);
  }

  async findById(id: string): Promise<Consent | null> {
    const record = await this.prisma.consent.findUnique({
      where: { id },
      include: consentInclude,
    });
    return record ? this.toDomain(record) : null;
  }

  async findManyByUser(userId: string, status?: ConsentStatus): Promise<Consent[]> {
    const records = await this.prisma.consent.findMany({
      where: { userId, status: status as PrismaConsentStatus | undefined },
      include: consentInclude,
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  async findActiveByUser(userId: string): Promise<Consent[]> {
    const records = await this.prisma.consent.findMany({
      where: { userId, status: 'ACTIVE', expiresAt: { gt: new Date() } },
      include: consentInclude,
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  async findEffectiveByUserBank(
    userId: string,
    bankId: string,
  ): Promise<Consent | null> {
    const record = await this.prisma.consent.findFirst({
      where: { userId, bankId, status: 'ACTIVE', expiresAt: { gt: new Date() } },
      include: consentInclude,
    });
    return record ? this.toDomain(record) : null;
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.consent.update({
      where: { id },
      data: { status: 'REVOKED', revokedAt: new Date() },
    });
  }

  async getBankRef(bankId: string): Promise<BankRef | null> {
    const bank = await this.prisma.bank.findUnique({ where: { id: bankId } });
    return bank
      ? { id: bank.id, adapterKey: bank.adapterKey, name: bank.name, isActive: bank.isActive }
      : null;
  }

  async getApplicationRef(applicationId: string): Promise<ApplicationRef | null> {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });
    return app ? { id: app.id, name: app.name, isActive: app.isActive } : null;
  }

  private toDomain(record: ConsentRecord): Consent {
    return new Consent({
      id: record.id,
      userId: record.userId,
      applicationId: record.applicationId,
      applicationName: record.application.name,
      bankId: record.bankId,
      bankName: record.bank.name,
      adapterKey: record.bank.adapterKey,
      status: record.status as ConsentStatus,
      scopes: record.scopes as ConsentScope[],
      expiresAt: record.expiresAt,
      revokedAt: record.revokedAt,
      createdAt: record.createdAt,
    });
  }
}
