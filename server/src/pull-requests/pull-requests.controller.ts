import { Controller, Get, Query } from '@nestjs/common';
import { PullRequestsService } from './pull-requests.service';

@Controller('pull-requests')
export class PullRequestsController {
  constructor(private readonly service: PullRequestsService) {}

  @Get('stats')
  getStats() {
    return this.service.getStats();
  }

  @Get('by-agent')
  getByAgent() {
    return this.service.getByAgent();
  }

  @Get('by-state')
  getByState() {
    return this.service.getByState();
  }

  @Get('over-time')
  getOverTime() {
    return this.service.getOverTime();
  }

  @Get('code-quality-stats')
  getCodeQualityStats() {
    return this.service.getCodeQualityStats();
  }

  @Get('code-quality-rows')
  getCodeQualityRows(
    @Query('page') page = '1',
    @Query('limit') limit = '25',
  ) {
    return this.service.getCodeQualityRows(parseInt(page), parseInt(limit));
  }

  @Get('code-review-stats')
  getCodeReviewStats() {
    return this.service.getCodeReviewStats();
  }

  @Get('code-review-rows')
  getCodeReviewRows(
    @Query('page') page = '1',
    @Query('limit') limit = '25',
  ) {
    return this.service.getCodeReviewRows(parseInt(page), parseInt(limit));
  }

  @Get()
  getRows(
    @Query('page') page = '1',
    @Query('limit') limit = '25',
  ) {
    return this.service.getRows(parseInt(page), parseInt(limit));
  }
}
