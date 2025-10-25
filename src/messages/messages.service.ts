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
