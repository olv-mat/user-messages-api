import { BaseEntity } from 'src/common/entities/base.entity';
import { RoutePolicies } from 'src/modules/auth/enums/route-policies.enum';
import { MessageEntity } from 'src/modules/message/entities/message.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'simple-array', nullable: true })
  policies: RoutePolicies[];

  @Column({ nullable: true })
  picture: string;

  // Messages Sent By The User
  @OneToMany(() => MessageEntity, (message) => message.sender)
  sentMessages: MessageEntity[];

  // Messages Received By The User
  @OneToMany(() => MessageEntity, (message) => message.recipient)
  receivedMessages: MessageEntity[];
}
