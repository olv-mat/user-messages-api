import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROUTE_POLICIES_KEY } from '../constants/route-policies-key.constant';
import { RoutePolicies } from '../enums/route-policies.enum';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPolicy = this.reflector.get<RoutePolicies | undefined>(
      ROUTE_POLICIES_KEY,
      context.getHandler(),
    );
    console.log(requiredPolicy);
    return true;
  }
}
