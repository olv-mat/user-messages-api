import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { MessageResponseDto } from './dtos/MessageResponse.dto';
import { UpdateMessageDto } from './dtos/UpdateMessage.dto';
import { MessageEntity } from './entities/message.entity';
import { MessageResponseMapper } from './mappers/message-response.mapper';

/*
  Scope.DEFAULT = The Provider In Question Is a Singleton.
  Scope.REQUEST = The Provider In Question Is Instantiated With Each Request.
  Scope.TRANSIENT = An Instance Of The Provider Is Created For Each Class That Injects It.
*/

@Injectable({ scope: Scope.DEFAULT })
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messagesRepository: Repository<MessageEntity>,
    private readonly usersService: UsersService,
  ) {}

  public async findAll(
    search?: string,
  ): Promise<MessageResponseDto | MessageResponseDto[]> {
    if (search) console.log(search);
    const messages = await this.messagesRepository.find();
    return MessageResponseMapper.toResponse(messages);
  }

  public async findOne(
    id: number,
  ): Promise<MessageResponseDto | MessageResponseDto[]> {
    const message = await this.getMessageById(id);
    return MessageResponseMapper.toResponse(message);
  }

  public async create(dto: CreateMessageDto): Promise<DefaultResponseDto> {
    const sender = await this.usersService.getUserById(dto.sender);
    const recipient = await this.usersService.getUserById(dto.recipient);
    const message = await this.messagesRepository.save({
      content: dto.content,
      sender: sender,
      recipient: recipient,
    });
    return ResponseMapper.toAResponse(
      message.id,
      'Message created successfully',
    );
  }

  public async update(
    id: number,
    dto: UpdateMessageDto,
  ): Promise<DefaultResponseDto> {
    const message = await this.getMessageById(id);
    await this.messagesRepository.update(message.id, dto);
    return ResponseMapper.toAResponse(
      message.id,
      'Message updated successfully',
    );
  }

  public async delete(id: number): Promise<DefaultResponseDto> {
    const message = await this.getMessageById(id);
    await this.messagesRepository.delete(message.id);
    return ResponseMapper.toAResponse(
      message.id,
      'Message deleted successfully',
    );
  }

  private async getMessageById(id: number): Promise<MessageEntity> {
    const message = await this.messagesRepository.findOne({
      where: { id: id },
    });
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }
}
