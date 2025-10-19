import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  public findAll(): string {
    return 'All found';
  }
}
