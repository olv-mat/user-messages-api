import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { MessagesService } from './messages.service';
import { MessageEntity } from './entities/message.entity';
import { UpdateMessageDto } from './dtos/UpdateMessage.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  public findAll(@Query('search') search?: string): MessageEntity[] {
    return this.messagesService.findAll(search);
  }

  @Get(':id')
  public findOne(@Param('id') id: string): MessageEntity {
    return this.messagesService.findOne(id);
  }

  @Post()
  public create(@Body() body: CreateMessageDto): { message: string } {
    return this.messagesService.create(body);
  }

  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body() body: UpdateMessageDto,
  ): { message: string } {
    return this.messagesService.update(id, body);
  }

  @Delete(':id')
  public delete(@Param('id') id: string): { message: string } {
    return this.messagesService.delete(id);
  }
}
