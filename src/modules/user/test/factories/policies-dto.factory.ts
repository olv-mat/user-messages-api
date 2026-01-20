import { RoutePolicies } from 'src/modules/auth/enums/route-policies.enum';
import { PoliciesDto } from '../../dtos/UpddatePolicies.dto';

export const makePoliciesDto = (
  override?: Partial<PoliciesDto>,
): PoliciesDto => {
  const dto = new PoliciesDto();
  Object.assign(dto, {
    policies: [RoutePolicies.USER_FIND_ALL],
    ...override,
  });
  return dto;
};
