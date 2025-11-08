/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/\S/, { message: 'content cannot contain only spaces' })
  readonly content: string;

  @IsInt()
  @IsPositive()
  readonly sender: number;

  @IsInt()
  @IsPositive()
  readonly recipient: number;
}
