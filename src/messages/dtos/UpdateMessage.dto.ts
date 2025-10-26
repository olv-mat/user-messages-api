/* eslint-disable @typescript-eslint/no-unsafe-call */
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateMessageDto } from './CreateMessage.dto';

// npm i @nestjs/mapped-types

export class UpdateMessageDto extends PartialType(
  OmitType(CreateMessageDto, ['sender', 'recipient'] as const),
) {
  @IsOptional()
  @IsBoolean()
  readonly read?: boolean;
}
