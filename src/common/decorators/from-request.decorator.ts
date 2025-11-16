import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const FromRequest = createParamDecorator(
  (data: keyof Request, context: ExecutionContext): unknown => {
    const request = context.switchToHttp().getRequest<Request>();
    return request[data];
  },
);
