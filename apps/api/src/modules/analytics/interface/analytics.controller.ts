import { Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AnalyticsOverview, AnalyticsSnapshot } from '@bankbridge/contracts';
import { CurrentUser } from '../../auth/interface/decorators/current-user.decorator';
import { GetOverviewUseCase } from '../application/get-overview.use-case';
import { RecomputeSnapshotsUseCase } from '../application/recompute-snapshots.use-case';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(
    private readonly getOverview: GetOverviewUseCase,
    private readonly recomputeSnapshots: RecomputeSnapshotsUseCase,
  ) {}

  @Get('overview')
  @ApiOperation({ summary: 'Spending overview: totals, categories, top merchants, trend' })
  overview(
    @CurrentUser('id') userId: string,
    @Query() query: AnalyticsQueryDto,
  ): Promise<AnalyticsOverview> {
    return this.getOverview.execute(userId, {
      months: query.months,
      force: query.force,
    });
  }

  @Get('snapshots')
  @ApiOperation({ summary: 'Persisted monthly analytics snapshots' })
  snapshots(
    @CurrentUser('id') userId: string,
    @Query() query: AnalyticsQueryDto,
  ): Promise<AnalyticsSnapshot[]> {
    return this.recomputeSnapshots.execute(userId, {
      months: query.months,
      force: query.force,
    });
  }

  @Post('recompute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Force a recompute of monthly analytics snapshots' })
  recompute(
    @CurrentUser('id') userId: string,
    @Query() query: AnalyticsQueryDto,
  ): Promise<AnalyticsSnapshot[]> {
    return this.recomputeSnapshots.execute(userId, {
      months: query.months,
      force: true,
    });
  }
}
