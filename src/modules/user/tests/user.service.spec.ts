/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { makeRegisterDto } from 'src/common/tests/factories/register-dto.factory';
import { makeCryptographyServiceMock } from 'src/common/tests/mocks/cryptography-service.mock';
import { makeRepositoryMock } from 'src/common/tests/mocks/repository.mock';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../user.service';

// npm i --D @nestjs/testing

type TestContext = {
  userService: UserService;
  userRepository: Repository<UserEntity>;
  cryptographyService: CryptographyService;
};

describe('UserService', () => {
  let context: TestContext;
  beforeEach(async () => {
    jest.clearAllMocks();
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
    context = {
      userService: module.get(UserService),
      userRepository: module.get(getRepositoryToken(UserEntity)),
      cryptographyService: module.get(CryptographyService),
    };
  });

  describe('create', () => {
    it('should create a new user if the email is not in use', async () => {
      // Arrange
      const { userService, userRepository, cryptographyService } = context;
      const dto = makeRegisterDto();
      const hashed = 'hashed';
      jest.spyOn(cryptographyService, 'hash').mockResolvedValue(hashed);
      // Act
      await userService.create(dto);
      // Assert
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(cryptographyService.hash).toHaveBeenCalledWith(dto.password);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...dto,
        password: hashed,
      });
    });
  });
});
