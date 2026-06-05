import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PullRequestsModule } from './pull-requests/pull-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PullRequestsModule,
  ],
})
export class AppModule {}
