import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { UserService } from 'src/modules/user/user.service';
import { ILike, Repository } from 'typeorm';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { UpdateMessageDto } from './dtos/UpdateMessage.dto';
import { MessageEntity } from './entities/message.entity';

/*
  Scope.DEFAULT: The provider in question is a singleton
  Scope.REQUEST: The provider in question is instantiated with each request
  Scope.TRANSIENT: An instance of the provider is created for each class that injects it
*/

@Injectable({ scope: Scope.DEFAULT })
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messagesRepository: Repository<MessageEntity>,
    private readonly userService: UserService,
  ) {}

  public findAll(search?: string): Promise<MessageEntity[]> {
    if (search) {
      return this.messagesRepository.find({
        where: { content: ILike(`%${search}%`) },
      });
    }
    return this.messagesRepository.find();
  }

  public findOne(id: number): Promise<MessageEntity> {
    return this.getMessageById(id);
  }

  public async create(
    dto: CreateMessageDto,
    user: UserInterface,
  ): Promise<MessageEntity> {
    const sender = await this.userService.findOne(user.sub);
    const recipient = await this.userService.findOne(dto.recipient);
    return this.messagesRepository.save({
      content: dto.content,
      sender: sender,
      recipient: recipient,
    });
  }

  public async update(
    id: number,
    dto: UpdateMessageDto,
    user: UserInterface,
  ): Promise<void> {
    const messageEntity = await this.getMessageById(id);
    this.assertMessageOwner(messageEntity, user);
    await this.messagesRepository.update(messageEntity.id, dto);
  }

  public async delete(id: number, user: UserInterface): Promise<void> {
    const messageEntity = await this.getMessageById(id);
    this.assertMessageOwner(messageEntity, user);
    await this.messagesRepository.delete(messageEntity.id);
  }

  private assertMessageOwner(
    messageEntity: MessageEntity,
    user: UserInterface,
  ): void {
    if (messageEntity.sender.id !== user.sub) {
      throw new ForbiddenException('You cannot perform this action');
    }
  }

  private async getMessageById(id: number): Promise<MessageEntity> {
    const messageEntity = await this.messagesRepository.findOne({
      where: { id: id },
    });
    if (!messageEntity) throw new NotFoundException('Message not found');
    return messageEntity;
  }
}
