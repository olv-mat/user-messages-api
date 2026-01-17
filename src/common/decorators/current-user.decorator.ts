import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserInterface } from '../interfaces/user.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserInterface | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>() as Request & {
      user: UserInterface;
    };
    return request.user;
  },
);
