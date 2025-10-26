import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { UpdateMessageDto } from './dtos/UpdateMessage.dto';

@Injectable()
export class MessagesService {
  private messages: MessageEntity[] = [];

  public findAll(search?: string): MessageEntity[] {
    if (search) {
      console.log(search);
    }
    return this.messages;
  }

  public findOne(id: string): MessageEntity {
    return this.findMessageById(id);
  }

  public create(body: CreateMessageDto): { message: string } {
    const message = new MessageEntity();
    message.id = this.messages.length;
    message.content = body.content;
    message.sender = body.sender;
    message.recipient = body.recipient;
    message.read = false;

    this.messages.push(message);
    return { message: 'Message created successfully' };
  }

  public update(id: string, body: UpdateMessageDto): { message: string } {
    const index = this.findMessageIndex(id);
    const message = this.messages[index];
    this.messages[index] = {
      ...message,
      ...body,
    };
    return { message: 'Message updated successfully' };
  }

  public delete(id: string): { message: string } {
    const index = this.findMessageIndex(id);
    this.messages.splice(index, 1);
    return { message: 'Message deleted successfully' };
  }

  private findMessageById(id: string): MessageEntity {
    const message = this.messages.find((item) => item.id === +id);
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  private findMessageIndex(id: string): number {
    const index = this.messages.findIndex((item) => item.id === +id);
    if (index < 0) {
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    }
    return index;
  }
}
