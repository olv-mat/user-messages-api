import { RoutePolicies } from 'src/modules/auth/enums/route-policies.enum';

export class RegisterRootUserDto {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly policies: RoutePolicies[],
  ) {}
}
