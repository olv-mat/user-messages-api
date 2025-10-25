import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('/healthCheck')
  public healthCheck(): void {}

  @Get()
  public findAll(): string {
    return this.messagesService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): string {
    return this.messagesService.findOne(id);
  }

  @Post()
  public create(@Body() body: any): string {
    return this.messagesService.create(body);
  }
}
