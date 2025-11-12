import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import chalk from 'chalk';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

export class RequestTimeInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestTimeInterceptor.name);

  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest<Request>();
        const method = request.method;
        const url = request.url;
        const elapsed = Date.now() - start;
        const coloredElapsed = chalk.yellow(`+${elapsed}ms`);
        this.logger.log(`Request {${url}, ${method}} took ${coloredElapsed}`);
      }),
    );
  }
}
