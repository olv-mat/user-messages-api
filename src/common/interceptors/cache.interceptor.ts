import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, of, tap } from 'rxjs';

export class CacheIntercepotor implements NestInterceptor {
  private readonly logger = new Logger(CacheIntercepotor.name);
  private readonly cache = new Map();

  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const url = request.url;
    const method = request.method;
    const key = `${method}:${url}`;
    if (this.cache.has(key)) {
      this.logger.log(`Cache hit {${url}, ${method}}`);
      return of(this.cache.get(key));
    }
    this.logger.warn(`Cache miss {${url}, ${method}}`);
    return next.handle().pipe(
      tap((response) => {
        this.cache.set(key, response);
        this.logger.log(`Cache stored {${url}, ${method}}`);
      }),
    );
  }
}
