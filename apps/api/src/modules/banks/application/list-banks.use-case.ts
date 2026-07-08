import { Injectable } from '@nestjs/common';
import type { Bank } from '@bankbridge/contracts';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class ListBanksUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<Bank[]> {
    const banks = await this.prisma.bank.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return banks.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      logoUrl: b.logoUrl,
      primaryColor: b.primaryColor,
      country: b.country,
      isActive: b.isActive,
    }));
  }
}
