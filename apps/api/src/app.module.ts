import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

// Feature modules (Clean Architecture: each is independent and self-contained).
// Modules are scaffolded empty in Step 2 and implemented one-by-one in later steps.
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BanksModule } from './modules/banks/banks.module';
import { BankAdaptersModule } from './modules/bank-adapters/bank-adapters.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ConsentModule } from './modules/consent/consent.module';
import { ApiGatewayModule } from './modules/api-gateway/api-gateway.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AiInsightsModule } from './modules/ai-insights/ai-insights.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DeveloperPortalModule } from './modules/developer-portal/developer-portal.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),

    AuthModule,
    UsersModule,
    BanksModule,
    BankAdaptersModule,
    AccountsModule,
    TransactionsModule,
    ConsentModule,
    ApiGatewayModule,
    AnalyticsModule,
    AiInsightsModule,
    NotificationsModule,
    DeveloperPortalModule,
    ApiKeysModule,
    AuditLogsModule,
    AdminModule,
  ],
})
export class AppModule {}
