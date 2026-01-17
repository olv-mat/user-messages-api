import { makeUserEntity } from 'src/common/tests/factories/user-entity.factory';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';

export function mockUsersFound(
  repository: Repository<UserEntity>,
  entities: UserEntity[] = [makeUserEntity()],
): UserEntity[] {
  jest.spyOn(repository, 'find').mockResolvedValue(entities);
  return entities;
}
