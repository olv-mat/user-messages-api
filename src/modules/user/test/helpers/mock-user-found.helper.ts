import { makeUserEntity } from 'src/common/tests/factories/user-entity.factory';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';

export function mockUserFound(
  repository: Repository<UserEntity>,
  override?: Partial<UserEntity>,
): UserEntity {
  const entity = makeUserEntity(override);
  jest.spyOn(repository, 'findOneBy').mockResolvedValue(entity);
  return entity;
}
