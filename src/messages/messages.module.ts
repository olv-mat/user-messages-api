import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { UsersModule } from 'src/users/users.module';
import { MessageEntity } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity]), UsersModule],
  controllers: [MessagesController],
  providers: [MessagesService, ResponseMapper],
})
export class MessagesModule {}
