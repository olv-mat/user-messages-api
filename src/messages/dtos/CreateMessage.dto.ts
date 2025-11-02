/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/\S/, { message: 'content cannot contain only spaces' })
  readonly content: string;

  // @IsNotEmpty()
  // @IsString()
  // @Matches(/\S/, { message: 'sender cannot contain only spaces' })
  // readonly sender: string;

  // @IsNotEmpty()
  // @IsString()
  // @Matches(/\S/, { message: 'recipient cannot contain only spaces' })
  // readonly recipient: string;
}
