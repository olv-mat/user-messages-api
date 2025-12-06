import { UserResponseDto } from 'src/modules/user/dtos/UserResponse.dto';

export class MessageResponseDto {
  public readonly id: number;
  public readonly content: string;
  public readonly sender: UserResponseDto;
  public readonly recipient: UserResponseDto;
  public readonly read: boolean;
  public readonly createdAt: Date;

  constructor(
    id: number,
    content: string,
    sender: UserResponseDto,
    recipient: UserResponseDto,
    read: boolean,
    createdAt: Date,
  ) {
    this.id = id;
    this.content = content;
    this.sender = sender;
    this.recipient = recipient;
    this.read = read;
    this.createdAt = createdAt;
  }
}
