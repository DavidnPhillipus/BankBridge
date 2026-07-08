import { Module } from '@nestjs/common';
import { BankAdapterRegistry } from './application/bank-adapter-registry.service';
import { BANK_ADAPTERS, type BankAdapterPort } from './domain/bank-adapter.port';
import { MockDataFactory } from './infrastructure/mock/mock-data.factory';
import { BankWindhoekAdapter } from './infrastructure/mock/bank-windhoek.adapter';
import { BankOfNamibiaAdapter } from './infrastructure/mock/bank-of-namibia.adapter';
import { FnbNamibiaAdapter } from './infrastructure/mock/fnb-namibia.adapter';
import { NampostAdapter } from './infrastructure/mock/nampost.adapter';
import { StandardBankNamibiaAdapter } from './infrastructure/mock/standard-bank-namibia.adapter';
import { NedbankNamibiaAdapter } from './infrastructure/mock/nedbank-namibia.adapter';

/**
 * Bank Adapters: the BankAdapterPort + one mock implementation per bank.
 *
 * To add or replace a bank: implement BankAdapterPort, add the class below and
 * to the BANK_ADAPTERS `inject` list. Nothing else in the platform changes.
 * The registry (exported) is what the API Gateway depends on.
 */
@Module({
  providers: [
    MockDataFactory,
    BankWindhoekAdapter,
    BankOfNamibiaAdapter,
    FnbNamibiaAdapter,
    NampostAdapter,
    StandardBankNamibiaAdapter,
    NedbankNamibiaAdapter,
    {
      provide: BANK_ADAPTERS,
      useFactory: (...adapters: BankAdapterPort[]): BankAdapterPort[] => adapters,
      inject: [
        BankWindhoekAdapter,
        BankOfNamibiaAdapter,
        FnbNamibiaAdapter,
        NampostAdapter,
        StandardBankNamibiaAdapter,
        NedbankNamibiaAdapter,
      ],
    },
    BankAdapterRegistry,
  ],
  exports: [BankAdapterRegistry, BANK_ADAPTERS],
})
export class BankAdaptersModule {}
