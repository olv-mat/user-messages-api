import { Module } from '@nestjs/common';
import { SERVER_NAME } from 'src/common/constants/server-name.constant';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [
    HealthService,
    {
      provide: SERVER_NAME, // Token
      useValue: 'User Messages API Server', // Value
    },
  ],
})
export class HealthModule {}
