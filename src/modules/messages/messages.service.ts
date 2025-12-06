import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/modules/user/users.service';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { UpdateMessageDto } from './dtos/UpdateMessage.dto';
import { MessageEntity } from './entities/message.entity';

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
    private readonly userService: UserService,
  ) {}

  public findAll(search?: string): Promise<MessageEntity[]> {
    if (search) console.log(search);
    return this.messagesRepository.find();
  }

  public findOne(id: number): Promise<MessageEntity> {
    return this.getMessageById(id);
  }

  public async create(dto: CreateMessageDto): Promise<MessageEntity> {
    const sender = await this.userService.findOne(dto.sender);
    const recipient = await this.userService.findOne(dto.recipient);
    return this.messagesRepository.save({
      content: dto.content,
      sender: sender,
      recipient: recipient,
    });
  }

  public async update(id: number, dto: UpdateMessageDto): Promise<void> {
    const message = await this.getMessageById(id);
    await this.messagesRepository.update(message.id, dto);
  }

  public async delete(id: number): Promise<void> {
    const message = await this.getMessageById(id);
    await this.messagesRepository.delete(message.id);
  }

  private async getMessageById(id: number): Promise<MessageEntity> {
    const message = await this.messagesRepository.findOne({
      where: { id: id },
    });
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }
}
