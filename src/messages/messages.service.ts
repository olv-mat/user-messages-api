import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { UpdateMessageDto } from './dtos/UpdateMessage.dto';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messagesRepository: Repository<MessageEntity>,
  ) {}

  public async findAll(search?: string): Promise<MessageEntity[]> {
    if (search) {
      console.log(search);
    }
    return await this.messagesRepository.find();
  }

  public async findOne(id: number): Promise<MessageEntity> {
    return await this.findMessageById(id);
  }

  public async create(
    dto: CreateMessageDto,
  ): Promise<{ id: number; message: string }> {
    const message = await this.messagesRepository.save(dto);
    return { id: message.id, message: 'Message created successfully' };
  }

  public async update(
    id: number,
    dto: UpdateMessageDto,
  ): Promise<{ message: string }> {
    const message = await this.findMessageById(id);
    await this.messagesRepository.update(message.id, dto);
    return { message: 'Message updated successfully' };
  }

  public async delete(id: number): Promise<{ message: string }> {
    const message = await this.findMessageById(id);
    await this.messagesRepository.delete(message.id);
    return { message: 'Message deleted successfully' };
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
