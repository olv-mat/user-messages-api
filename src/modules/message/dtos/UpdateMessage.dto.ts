import { OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateMessageDto } from './CreateMessage.dto';

// npm i @nestjs/mapped-types

export class UpdateMessageDto extends PartialType(
  OmitType(CreateMessageDto, ['recipient'] as const),
) {
  @IsOptional()
  @IsBoolean()
  public readonly read?: boolean;
}
