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
import { UpdateMessageDto } from './dtos/UpdateMessage.dto';
import { MessageEntity } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  public findAll(@Query('search') search?: string): Promise<MessageEntity[]> {
    return this.messagesService.findAll(search);
  }

  @Get(':id')
  public findOne(@Param('id') id: number): Promise<MessageEntity> {
    return this.messagesService.findOne(id);
  }

  @Post()
  public create(@Body() dto: CreateMessageDto): { message: string } {
    return this.messagesService.create(dto);
  }

  @Patch(':id')
  public update(
    @Param('id') id: number,
    @Body() dto: UpdateMessageDto,
  ): { message: string } {
    return this.messagesService.update(id, dto);
  }

  @Delete(':id')
  public delete(@Param('id') id: number): { message: string } {
    return this.messagesService.delete(id);
  }
}
