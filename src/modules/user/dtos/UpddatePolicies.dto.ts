import { ArrayNotEmpty, IsArray, IsEnum } from 'class-validator';
import { RoutePolicies } from 'src/modules/auth/enums/route-policies.enum';

export class PoliciesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(RoutePolicies, { each: true })
  public readonly policies: RoutePolicies[];
}
