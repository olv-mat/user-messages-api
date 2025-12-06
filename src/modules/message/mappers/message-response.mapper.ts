import { UserResponseMapper } from 'src/modules/user/mappers/user-response.mapper';
import { MessageResponseDto } from '../dtos/MessageResponse.dto';
import { MessageEntity } from '../entities/message.entity';

export class MessageResponseMapper {
  public static toResponseMany = (messagesEntities: MessageEntity[]) =>
    this.toDtoList(messagesEntities);
  public static toResponseOne = (messageEntity: MessageEntity) =>
    this.toDto(messageEntity);

  private static toDtoList(messagesEntities: MessageEntity[]) {
    return messagesEntities.map((messageEntity) => this.toDto(messageEntity));
  }

  private static toDto(messageEntity: MessageEntity): MessageResponseDto {
    const { id, content, read, createdAt, sender, recipient } = messageEntity;
    return new MessageResponseDto(
      id,
      content,
      UserResponseMapper.toDto(sender),
      UserResponseMapper.toDto(recipient),
      read,
      createdAt,
    );
  }
}
