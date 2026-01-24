import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SwaggerInternalServerError } from 'src/common/swagger/responses.swagger';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('check')
  @ApiOperation({ summary: 'Check application health' })
  @SwaggerInternalServerError()
  public check(): void {
    return this.healthService.check();
  }
}
