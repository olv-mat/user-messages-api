import { Injectable } from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dtos/CreateMessage.dto';

@Injectable()
export class MessagesService {
  private messages: MessageEntity[] = [];

  public findAll(search?: string): string {
    if (search) {
      console.log(search);
    }
    return 'All messages found';
  }

  public findOne(id: string): string {
    console.log(id);
    return 'One message found';
  }

  public create(body: CreateMessageDto): string {
    const message = new MessageEntity();
    message.id = this.messages.length;
    message.content = body.content;
    message.sender = body.sender;
    message.recipient = body.recipient;
    message.read = false;

    this.messages.push(message);
    return 'Message created successfully';
  }

  public update(id: string, body: any): string {
    console.log(id);
    console.log(body);
    return 'Message updated successfully';
  }

  public delete(id: string): string {
    console.log(id);
    return 'Message deleted successfully';
  }
}
