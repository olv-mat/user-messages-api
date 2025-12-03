import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserInterface } from '../interfaces/user.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof UserInterface | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>() as Request & {
      user?: UserInterface;
    };
    const user = request.user as UserInterface;
    if (!data) return user;
    return user[data];
  },
);
