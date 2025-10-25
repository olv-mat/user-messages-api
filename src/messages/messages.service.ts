import { Injectable } from '@nestjs/common';
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

  public findOne(id: string): MessageEntity | undefined {
    return this.messages.find((item) => item.id === +id);
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
    const index = this.messages.findIndex((item) => item.id === +id);
    if (index >= 0) {
      const message = this.messages[index];
      this.messages[index] = {
        ...message,
        ...body,
      };
    }
    return { message: 'Message updated successfully' };
  }

  public delete(id: string): { message: string } {
    const index = this.messages.findIndex((item) => item.id === +id);
    if (index >= 0) {
      this.messages.splice(index, 1);
    }
    return { message: 'Message deleted successfully' };
  }
}
