import { NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export class RequestUuidMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction) {
    res.setHeader('X-Request-Uuid', randomUUID());
    next();
  }
}
