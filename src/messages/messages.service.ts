import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionResponseDto } from 'src/common/dtos/ActionResponse.dto';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { UpdateMessageDto } from './dtos/UpdateMessage.dto';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messagesRepository: Repository<MessageEntity>,
    private readonly responseMapper: ResponseMapper,
    private readonly usersService: UsersService,
  ) {}

  public async findAll(
    search?: string,
  ): Promise<MessageEntity | MessageEntity[]> {
    if (search) console.log(search);
    const messages = await this.messagesRepository.find();
    return this.responseMapper.toResponse(MessageEntity, messages);
  }

  public async findOne(id: number): Promise<MessageEntity | MessageEntity[]> {
    const message = await this.findMessageById(id);
    return this.responseMapper.toResponse(MessageEntity, message);
  }

  public async create(dto: CreateMessageDto): Promise<ActionResponseDto> {
    const sender = await this.usersService.findUserById(dto.sender);
    const recipient = await this.usersService.findUserById(dto.recipient);
    const message = await this.messagesRepository.save({
      content: dto.content,
      sender: sender,
      recipient: recipient,
    });
    return this.responseMapper.toActionResponse(
      message.id,
      'Message created successfully',
    );
  }

  public async update(
    id: number,
    dto: UpdateMessageDto,
  ): Promise<MessageResponseDto> {
    const message = await this.findMessageById(id);
    await this.messagesRepository.update(message.id, dto);
    return this.responseMapper.toMessageResponse(
      'Message updated successfully',
    );
  }

  public async delete(id: number): Promise<MessageResponseDto> {
    const message = await this.findMessageById(id);
    await this.messagesRepository.delete(message.id);
    return this.responseMapper.toMessageResponse(
      'Message deleted successfully',
    );
  }

  private async findMessageById(id: number): Promise<MessageEntity> {
    const message = await this.messagesRepository.findOne({
      where: { id: id },
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }
}
