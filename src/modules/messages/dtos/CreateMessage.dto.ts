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
  public readonly content: string;

  @IsInt()
  @IsPositive()
  public readonly sender: number;

  @IsInt()
  @IsPositive()
  public readonly recipient: number;
}
