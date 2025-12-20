import { Module } from '@nestjs/common';
import { SERVER_NAME } from 'src/modules/health/constants/server-name.constant';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [
    HealthService,
    {
      provide: SERVER_NAME,
      useValue: 'User Messages API Server',
    },
  ],
})
export class HealthModule {}
