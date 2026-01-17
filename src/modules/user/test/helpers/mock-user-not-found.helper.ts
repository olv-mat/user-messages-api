import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';

export function mockUserNotFound(repository: Repository<UserEntity>) {
  jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
}
