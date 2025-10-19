import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  public findAll(): string {
    return 'All messages found';
  }

  public findOne(id: string): string {
    console.log(id);
    return 'One message found';
  }

  public create(body: any): string {
    console.log(body);
    return 'Message created';
  }
}
