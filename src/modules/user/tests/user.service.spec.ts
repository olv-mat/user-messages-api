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
  service: UserService;
  repository: Repository<UserEntity>;
  cryptography: CryptographyService;
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
      service: module.get(UserService),
      repository: module.get(getRepositoryToken(UserEntity)),
      cryptography: module.get(CryptographyService),
    };
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const { service, repository } = context;
      const entities = [makeUserEntity()];
      jest.spyOn(repository, 'find').mockResolvedValue(entities);
      const result = await service.findAll();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(entities);
    });

    it('should return an empty list if there are no users', async () => {
      const { service, repository } = context;
      const entities = [];
      jest.spyOn(repository, 'find').mockResolvedValue(entities);
      const result = await service.findAll();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(entities);
    });
  });

  describe('create', () => {
    it('should create a user if the email is available', async () => {
      const { service, repository, cryptography } = context;
      const dto = makeRegisterDto();
      const entity = makeUserEntity();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(cryptography, 'hash').mockResolvedValue('');
      jest.spyOn(repository, 'save').mockResolvedValue(entity);
      const result = await service.create(dto);
      expect(repository.findOneBy).toHaveBeenCalledWith({ email: dto.email });
      expect(cryptography.hash).toHaveBeenCalledWith(dto.password);
      expect(repository.save).toHaveBeenCalledWith({
        ...dto,
        password: '',
      });
      expect(result).toEqual(entity);
    });

    it('should throws a conflict exception if the email is unavailable', async () => {
      const { service, repository } = context;
      const dto = makeRegisterDto();
      const entity = makeUserEntity();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(entity);
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});
