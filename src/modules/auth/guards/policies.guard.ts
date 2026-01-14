import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { UserService } from 'src/modules/user/user.service';
import { ROUTE_POLICIES_KEY } from '../constants/route-policies-key.constant';
import { RoutePolicies } from '../enums/route-policies.enum';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>() as Request & {
      user: UserInterface;
    };
    const user = request.user;
    const policy = this.reflector.get<RoutePolicies>(
      ROUTE_POLICIES_KEY,
      context.getHandler(),
    );
    const userEntity = await this.userService.findOne(user.sub);
    return userEntity.policies?.includes(policy) ?? false;
  }
}
