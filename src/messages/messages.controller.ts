import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ActionResponseDto } from 'src/common/dtos/ActionResponse.dto';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { CacheIntercepotor } from 'src/common/interceptors/cache.interceptor';
import { ChangeResponseInterceptor } from 'src/common/interceptors/change-response.interceptor';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { UpdateMessageDto } from './dtos/UpdateMessage.dto';
import { MessageEntity } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @UseInterceptors(CacheIntercepotor)
  @UseInterceptors(ChangeResponseInterceptor)
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
