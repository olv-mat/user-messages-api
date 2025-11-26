import { UserResponseMapper } from 'src/modules/users/mappers/user-response.mapper';
import { MessageResponseDto } from '../dtos/MessageResponse.dto';
import { MessageEntity } from '../entities/message.entity';

export class MessageResponseMapper {
  public static toResponse(
    input: MessageEntity | MessageEntity[],
  ): MessageResponseDto | MessageResponseDto[] {
    return Array.isArray(input) ? this.toDtoList(input) : this.toDto(input);
  }

  public static toDto(message: MessageEntity): MessageResponseDto {
    const { id, content, read, createdAt, sender, recipient } = message;
    return new MessageResponseDto(
      id,
      content,
      UserResponseMapper.toDto(sender),
      UserResponseMapper.toDto(recipient),
      read,
      createdAt,
    );
  }

  private static toDtoList(messages: MessageEntity[]) {
    return messages.map((message) => this.toDto(message));
  }
}
