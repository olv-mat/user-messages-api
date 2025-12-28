/* eslint-disable @typescript-eslint/unbound-method */
import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { makeRegisterDto } from 'src/common/tests/factories/register-dto.factory';
import { makeUserEntity } from 'src/common/tests/factories/user-entity.factory';
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
    it('should create a new user if the email is available', async () => {
      // Arranges
      const { userService, userRepository, cryptographyService } = context;
      const registerDto = makeRegisterDto();
      const userEntity = makeUserEntity();
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(cryptographyService, 'hash').mockResolvedValue('');
      jest.spyOn(userRepository, 'save').mockResolvedValue(userEntity);
      // Act
      const result = await userService.create(registerDto);
      // Asserts
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: registerDto.email,
      });
      expect(cryptographyService.hash).toHaveBeenCalledWith(
        registerDto.password,
      );
      expect(userRepository.save).toHaveBeenCalledWith({
        ...registerDto,
        password: '',
      });
      expect(result).toEqual(userEntity);
    });

    it('should throws a conflict exception if the email is unavailable', async () => {
      // Arranges
      const { userService, userRepository } = context;
      const registerDto = makeRegisterDto();
      const existingUser = makeUserEntity();
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(existingUser);
      // Act & Asserts
      await expect(userService.create(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });
});
