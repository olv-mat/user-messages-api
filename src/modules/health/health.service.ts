import { Inject, Injectable, Logger } from '@nestjs/common';
import { SERVER_NAME } from 'src/modules/health/constants/server-name.constant';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(@Inject(SERVER_NAME) private readonly serverName: string) {}

  public check(): void {
    this.logger.log(this.serverName);
  }
}
