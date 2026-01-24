import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  public readonly content: string;

  @IsInt()
  @IsPositive()
  public readonly recipient: number;
}
