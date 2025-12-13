import { PartialType } from '@nestjs/mapped-types';
import { ArrayNotEmpty, IsArray, IsEnum, IsOptional } from 'class-validator';
import { RoutePolicies } from 'src/modules/auth/enums/route-policies.enum';
import { RegisterDto } from '../../auth/dtos/Register.dto';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(RoutePolicies, { each: true })
  public readonly policies: RoutePolicies[];
}
