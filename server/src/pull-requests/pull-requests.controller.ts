import { Controller, Get } from '@nestjs/common';
import { PullRequestsService } from './pull-requests.service';

@Controller('pull-requests')
export class PullRequestsController {
  constructor(private readonly service: PullRequestsService) {}

  @Get()
  getData() {
    return this.service.getData();
  }
}
