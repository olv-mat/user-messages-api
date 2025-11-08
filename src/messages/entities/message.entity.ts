import { Expose } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('messages')
export class MessageEntity extends BaseEntity {
  @Expose()
  @Column({ type: 'text' })
  content: string;

  // Users Can Send Many Messages
  @Expose()
  @ManyToOne(() => UserEntity, (user) => user.sentMessages, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'sender' })
  sender: UserEntity;

  // Users Can Receive Many Messages
  @Expose()
  @ManyToOne(() => UserEntity, (user) => user.receivedMessages, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'recipient' })
  recipient: UserEntity;

  @Expose()
  @Column({ default: false })
  read: boolean;
}
