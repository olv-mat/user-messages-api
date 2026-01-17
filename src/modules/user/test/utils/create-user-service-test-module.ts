import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { makeCryptographyServiceMock } from 'src/common/tests/mocks/cryptography-service.mock';
import { makeRepositoryMock } from 'src/common/tests/mocks/repository.mock';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { UserService } from '../../user.service';
import { UserServiceTestContext } from '../types/user-service-test-context.type';

// npm i --D @nestjs/testing

export async function createUserServiceTestModule(): Promise<UserServiceTestContext> {
  const module = await Test.createTestingModule({
    providers: [
      UserService,
      {
        provide: getRepositoryToken(UserEntity),
        useValue: makeRepositoryMock(),
      },
      {
        provide: CryptographyService,
        useValue: makeCryptographyServiceMock(),
      },
    ],
  }).compile();
  return {
    userService: module.get(UserService),
    userRepository: module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    ),
    cryptographyService: module.get(CryptographyService),
  };
}
