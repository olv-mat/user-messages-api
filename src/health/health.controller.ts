import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { HealthService } from './health.service';

@Controller('health')
@UseInterceptors(AddHeaderInterceptor)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('check')
  public check(): void {
    return this.healthService.check();
  }
}
