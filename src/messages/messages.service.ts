import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { UpdateMessageDto } from './dtos/UpdateMessage.dto';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessagesService {
  private messages: MessageEntity[] = [];

  public findAll(search?: string): MessageEntity[] {
    if (search) {
      console.log(search);
    }
    return this.messages;
  }

  public findOne(id: number): MessageEntity {
    return this.findMessageById(id);
  }

  public create(dto: CreateMessageDto): { message: string } {
    const message = new MessageEntity();
    message.id = this.messages.length;
    message.content = dto.content;
    message.sender = dto.sender;
    message.recipient = dto.recipient;
    message.read = false;

    this.messages.push(message);
    return { message: 'Message created successfully' };
  }

  public update(id: number, dto: UpdateMessageDto): { message: string } {
    const index = this.findMessageIndex(id);
    const message = this.messages[index];
    this.messages[index] = {
      ...message,
      ...dto,
    };
    return { message: 'Message updated successfully' };
  }

  public delete(id: number): { message: string } {
    const index = this.findMessageIndex(id);
    this.messages.splice(index, 1);
    return { message: 'Message deleted successfully' };
  }

  private findMessageById(id: number): MessageEntity {
    const message = this.messages.find((item) => item.id === id);
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  private findMessageIndex(id: number): number {
    const index = this.messages.findIndex((item) => item.id === +id);
    if (index < 0) {
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    }
    return index;
  }
}
