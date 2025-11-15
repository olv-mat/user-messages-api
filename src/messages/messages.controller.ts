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
import { ActionResponseDto } from 'src/common/dtos/ActionResponse.dto';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { UpdateMessageDto } from './dtos/UpdateMessage.dto';
import { MessageEntity } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  public findAll(
    @Query('search') search?: string,
  ): Promise<MessageEntity | MessageEntity[]> {
    return this.messagesService.findAll(search);
  }

  @Get(':id')
  public findOne(
    @Param('id') id: number,
  ): Promise<MessageEntity | MessageEntity[]> {
    return this.messagesService.findOne(id);
  }

  @Post()
  public create(@Body() dto: CreateMessageDto): Promise<ActionResponseDto> {
    return this.messagesService.create(dto);
  }

  @Patch(':id')
  public update(
    @Param('id') id: number,
    @Body() dto: UpdateMessageDto,
  ): Promise<MessageResponseDto> {
    return this.messagesService.update(id, dto);
  }

  @Delete(':id')
  public delete(@Param('id') id: number): Promise<MessageResponseDto> {
    return this.messagesService.delete(id);
  }
}
