import { Module } from '@nestjs/common';
import { BankAdaptersModule } from '../bank-adapters/bank-adapters.module';
import { GatewayService } from './application/gateway.service';
import { NormalizerRegistry } from './application/normalizer-registry.service';
import {
  BANK_NORMALIZERS,
  type BankNormalizer,
} from './domain/bank-normalizer.port';
import { BankWindhoekNormalizer } from './infrastructure/normalizers/bank-windhoek.normalizer';
import { BankOfNamibiaNormalizer } from './infrastructure/normalizers/bank-of-namibia.normalizer';
import { FnbNamibiaNormalizer } from './infrastructure/normalizers/fnb-namibia.normalizer';
import { NampostNormalizer } from './infrastructure/normalizers/nampost.normalizer';
import { StandardBankNamibiaNormalizer } from './infrastructure/normalizers/standard-bank-namibia.normalizer';
import { NedbankNamibiaNormalizer } from './infrastructure/normalizers/nedbank-namibia.normalizer';

/**
 * API Gateway: orchestrates adapter calls + normalization into the canonical
 * format (Anti-Corruption Layer). Exports GatewayService, which the accounts,
 * transactions, and analytics modules depend on.
 *
 * One normalizer per bank dialect — added alongside its adapter.
 */
@Module({
  imports: [BankAdaptersModule],
  providers: [
    BankWindhoekNormalizer,
    BankOfNamibiaNormalizer,
    FnbNamibiaNormalizer,
    NampostNormalizer,
    StandardBankNamibiaNormalizer,
    NedbankNamibiaNormalizer,
    {
      provide: BANK_NORMALIZERS,
      useFactory: (...normalizers: BankNormalizer[]): BankNormalizer[] =>
        normalizers,
      inject: [
        BankWindhoekNormalizer,
        BankOfNamibiaNormalizer,
        FnbNamibiaNormalizer,
        NampostNormalizer,
        StandardBankNamibiaNormalizer,
        NedbankNamibiaNormalizer,
      ],
    },
    NormalizerRegistry,
    GatewayService,
  ],
  exports: [GatewayService],
})
export class ApiGatewayModule {}
