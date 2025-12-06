import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DefaultMessageResponseDto } from 'src/common/dtos/DefaultMessageResponse.dto';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { MessageResponseDto } from './dtos/MessageResponse.dto';
import { UpdateMessageDto } from './dtos/UpdateMessage.dto';
import { MessageResponseMapper } from './mappers/message-response.mapper';
import { MessageService } from './message.service';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  public async findAll(
    @Query('search') search?: string,
  ): Promise<MessageResponseDto[]> {
    const messages = await this.messageService.findAll(search);
    return MessageResponseMapper.toResponseMany(messages);
  }

  @Get(':id')
  public async findOne(@Param('id') id: number): Promise<MessageResponseDto> {
    const message = await this.messageService.findOne(id);
    return MessageResponseMapper.toResponseOne(message);
  }

  @Post()
  public async create(
    @Body() dto: CreateMessageDto,
  ): Promise<DefaultResponseDto> {
    const message = await this.messageService.create(dto);
    return ResponseMapper.toResponse(
      DefaultResponseDto,
      message.id,
      'Message created successfully',
    );
  }

  @Patch(':id')
  public async update(
    @Param('id') id: number,
    @Body() dto: UpdateMessageDto,
  ): Promise<DefaultMessageResponseDto> {
    await this.messageService.update(id, dto);
    return ResponseMapper.toResponse(
      DefaultMessageResponseDto,
      'Message updated successfully',
    );
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: number,
  ): Promise<DefaultMessageResponseDto> {
    await this.messageService.delete(id);
    return ResponseMapper.toResponse(
      DefaultMessageResponseDto,
      'Message deleted successfully',
    );
  }
}
