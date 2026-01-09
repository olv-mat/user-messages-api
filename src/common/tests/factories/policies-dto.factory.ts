import { RoutePolicies } from 'src/modules/auth/enums/route-policies.enum';
import { PoliciesDto } from 'src/modules/user/dtos/UpddatePolicies.dto';

export const makePoliciesDto = (
  override?: Partial<PoliciesDto>,
): PoliciesDto => ({
  policies: [RoutePolicies.USER_FIND_ALL],
  ...override,
});
