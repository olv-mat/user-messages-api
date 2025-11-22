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
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { MessageResponseDto } from './dtos/MessageResponse.dto';
import { UpdateMessageDto } from './dtos/UpdateMessage.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  public findAll(
    @Query('search') search?: string,
  ): Promise<MessageResponseDto | MessageResponseDto[]> {
    return this.messagesService.findAll(search);
  }

  @Get(':id')
  public findOne(
    @Param('id') id: number,
  ): Promise<MessageResponseDto | MessageResponseDto[]> {
    return this.messagesService.findOne(id);
  }

  @Post()
  public create(@Body() dto: CreateMessageDto): Promise<DefaultResponseDto> {
    return this.messagesService.create(dto);
  }

  @Patch(':id')
  public update(
    @Param('id') id: number,
    @Body() dto: UpdateMessageDto,
  ): Promise<DefaultResponseDto> {
    return this.messagesService.update(id, dto);
  }

  @Delete(':id')
  public delete(@Param('id') id: number): Promise<DefaultResponseDto> {
    return this.messagesService.delete(id);
  }
}
