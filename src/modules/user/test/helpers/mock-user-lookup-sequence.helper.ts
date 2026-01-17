import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';

export function mockUserLookupSequence(
  repository: Repository<UserEntity>,
  results: Array<UserEntity | null>,
) {
  const spy = jest.spyOn(repository, 'findOneBy');
  results.forEach((result) => {
    spy.mockResolvedValueOnce(result);
  });
}
