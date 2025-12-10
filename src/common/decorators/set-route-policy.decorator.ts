import { SetMetadata } from '@nestjs/common';
import { ROUTE_POLICIES_KEY } from 'src/modules/auth/constants/route-policies-key.constant';
import { RoutePolicies } from 'src/modules/auth/enums/route-policies.enum';

export const SetRoutePolicy = (policy: RoutePolicies) => {
  return SetMetadata(ROUTE_POLICIES_KEY, policy);
};
