import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  public check(): void {}
}
