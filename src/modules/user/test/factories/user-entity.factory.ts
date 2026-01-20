import { UserEntity } from '../../entities/user.entity';

export const makeUserEntity = (override?: Partial<UserEntity>): UserEntity => ({
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: '',
  policies: null,
  picture: null,
  sentMessages: [],
  receivedMessages: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  ...override,
});
