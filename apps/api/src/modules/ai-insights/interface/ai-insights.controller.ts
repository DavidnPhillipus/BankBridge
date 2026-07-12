import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AiInsightsResponse } from '@bankbridge/contracts';
import { CurrentUser } from '../../auth/interface/decorators/current-user.decorator';
import { Roles } from '../../auth/interface/decorators/roles.decorator';
import { GenerateInsightsUseCase } from '../application/generate-insights.use-case';
import { InsightsQueryDto } from './dto/insights-query.dto';

@ApiTags('AI Insights')
@ApiBearerAuth()
@Roles('CUSTOMER')
@Controller({ path: 'ai-insights', version: '1' })
export class AiInsightsController {
  constructor(private readonly generateInsights: GenerateInsightsUseCase) {}

  @Get()
  @ApiOperation({ summary: 'AI-generated financial insights and recommendations' })
  insights(
    @CurrentUser('id') userId: string,
    @Query() query: InsightsQueryDto,
  ): Promise<AiInsightsResponse> {
    return this.generateInsights.execute(userId, {
      months: query.months,
      force: query.force,
    });
  }
}
