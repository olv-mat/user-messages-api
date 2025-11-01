import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { UpdateMessageDto } from './dtos/UpdateMessage.dto';
import { MessageEntity } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messagesRepository: Repository<MessageEntity>,
  ) {}

  private messages: MessageEntity[] = [];

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
    const newMessage = await this.messagesRepository.save(dto);
    return { id: newMessage.id, message: 'Message created successfully' };
  }

  public update(id: number, dto: UpdateMessageDto): { message: string } {
    const index = this.findMessageIndex(id);
    const message = this.messages[index];
    this.messages[index] = {
      ...message,
      ...dto,
    };
    return { message: 'Message updated successfully' };
  }

  public delete(id: number): { message: string } {
    const index = this.findMessageIndex(id);
    this.messages.splice(index, 1);
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

  private findMessageIndex(id: number): number {
    const index = this.messages.findIndex((item) => item.id === +id);
    if (index < 0) {
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    }
    return index;
  }
}
