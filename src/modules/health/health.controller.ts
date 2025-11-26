import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('check')
  public check(): void {
    return this.healthService.check();
  }
}
