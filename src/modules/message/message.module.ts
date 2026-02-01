import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/modules/user/user.module';
import { ChatModule } from '../chat/chat.module';
import { MessageEntity } from './entities/message.entity';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity]), UserModule, ChatModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
