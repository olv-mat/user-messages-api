import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from '../../auth/dtos/Register.dto';

export class UpdateUserDto extends PartialType(RegisterDto) {}
