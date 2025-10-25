import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { HealthModule } from './health/health.module';

/*
  nest generate resource <resource> ||
  nest g res <resource>
*/

@Module({
  imports: [MessagesModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
