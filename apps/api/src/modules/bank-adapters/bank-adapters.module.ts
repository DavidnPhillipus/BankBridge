import { Module } from '@nestjs/common';

/**
 * Bank Adapters: the BankAdapterPort interface + one implementation per bank.
 * Mock adapters (Bank Windhoek, FNB, Standard Bank, Nedbank) built in Step 6.
 * Each adapter returns bank-specific JSON; normalization lives in the API Gateway.
 */
@Module({})
export class BankAdaptersModule {}
