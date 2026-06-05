import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PullRequestsController } from './pull-requests.controller';
import { PullRequestsService } from './pull-requests.service';

@Module({
  imports: [HttpModule],
  controllers: [PullRequestsController],
  providers: [PullRequestsService],
})
export class PullRequestsModule {}
