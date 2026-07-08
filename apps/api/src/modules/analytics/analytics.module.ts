import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { ConsentModule } from '../consent/consent.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { AnalyticsSyncService } from './application/analytics-sync.service';
import { GetOverviewUseCase } from './application/get-overview.use-case';
import { RecomputeSnapshotsUseCase } from './application/recompute-snapshots.use-case';
import { ANALYTICS_REPOSITORY } from './domain/analytics-repository.port';
import { PrismaAnalyticsRepository } from './infrastructure/prisma-analytics.repository';
import { AnalyticsController } from './interface/analytics.controller';

/**
 * Analytics: aggregates persisted, category-resolved transactions into a
 * spending overview and monthly snapshots. Reuses the accounts + transactions
 * sync paths (consent-gated) so figures reflect only authorized bank data.
 */
@Module({
  imports: [AccountsModule, TransactionsModule, ConsentModule],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsSyncService,
    GetOverviewUseCase,
    RecomputeSnapshotsUseCase,
    { provide: ANALYTICS_REPOSITORY, useClass: PrismaAnalyticsRepository },
  ],
  exports: [AnalyticsSyncService, ANALYTICS_REPOSITORY, GetOverviewUseCase],
})
export class AnalyticsModule {}
