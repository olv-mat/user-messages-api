import { BaseEntity } from 'src/common/entities/base.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('messages')
export class MessageEntity extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  // Users Can Send Many Messages
  @ManyToOne(() => UserEntity, (user) => user.sentMessages)
  @JoinColumn({ name: 'sender' })
  sender: UserEntity;

  // Users Can Receive Many Messages
  @ManyToOne(() => UserEntity, (user) => user.receivedMessages)
  @JoinColumn({ name: 'recipent' })
  recipient: UserEntity;

  @Column({ default: false })
  read: boolean;
}
