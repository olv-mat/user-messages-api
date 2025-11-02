import { BaseEntity } from 'src/common/entities/base.entity';
import { MessageEntity } from 'src/messages/entities/message.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  // Messages Sent By The User
  @OneToMany(() => MessageEntity, (message) => message.sender)
  sentMessages: MessageEntity[];

  // Messages Received By The User
  @OneToMany(() => MessageEntity, (message) => message.recipient)
  receivedMessages: MessageEntity[];
}
