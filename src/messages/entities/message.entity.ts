import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('messages')
export class MessageEntity extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @Column()
  sender: string;

  @Column()
  recipient: string;

  @Column({ default: false })
  read: boolean;
}
