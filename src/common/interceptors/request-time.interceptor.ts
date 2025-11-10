import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class RequestTimeInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestTimeInterceptor.name);

  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest<Request>();
        const method = request.method;
        const url = request.url;
        const elapsed = Date.now() - start;
        this.logger.log(
          `Request ${method} ${url} took ${elapsed} milliseconds`,
        );
      }),
    );
  }
}
