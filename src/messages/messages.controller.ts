import { Controller, Get, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  public findAll(): string {
    return this.messagesService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): string {
    return this.messagesService.findOne(id);
  }
}
