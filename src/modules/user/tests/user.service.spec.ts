/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { makePicture } from 'src/common/tests/factories/picture.factory';
import { makePoliciesDto } from 'src/common/tests/factories/policies-dto.factory';
import { makeRegisterDto } from 'src/common/tests/factories/register-dto.factory';
import { makeUpdateUserDto } from 'src/common/tests/factories/update-user-dto.factory';
import { makeUserEntity } from 'src/common/tests/factories/user-entity.factory';
import { makeCryptographyMock } from 'src/common/tests/mocks/cryptography.mock';
import { makeRepositoryMock } from 'src/common/tests/mocks/repository.mock';
import { RoutePolicies } from 'src/modules/auth/enums/route-policies.enum';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../user.service';

// npm i --D @nestjs/testing

type TestContext = {
  service: UserService;
  repository: Repository<UserEntity>;
  cryptography: CryptographyService;
};

jest.mock('fs/promises');
jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

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
          useValue: makeCryptographyMock(),
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

  describe('findOne', () => {
    it('should return a specific user', async () => {
      const { service, repository } = context;
      const sub = 1;
      const entity = makeUserEntity();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(entity);
      const result = await service.findOne(sub);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(result).toEqual(entity);
    });

    it('should throw a not found exception if the user does not exist', async () => {
      const { service, repository } = context;
      const sub = 0;
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      await expect(service.findOne(sub)).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: sub });
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

    it('should throw a conflict exception if the email is unavailable', async () => {
      const { service, repository } = context;
      const dto = makeRegisterDto();
      const entity = makeUserEntity();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(entity);
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update user without checking email or hashing password', async () => {
      const { service, repository, cryptography } = context;
      const sub = 1;
      const dto = makeUpdateUserDto();
      const entity = makeUserEntity();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(entity);
      await service.update(sub, dto);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(cryptography.hash).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledWith(entity.id, dto);
    });

    it('should check email availability when email is changed', async () => {
      const { service, repository } = context;
      const sub = 1;
      const dto = makeUpdateUserDto({ email: 'john.doe@test.com' });
      const entity = makeUserEntity();
      jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(entity)
        .mockResolvedValueOnce(null);
      await service.update(sub, dto);
      expect(repository.findOneBy).toHaveBeenCalledTimes(2);
      expect(repository.update).toHaveBeenCalledWith(entity.id, dto);
    });

    it('should not check email availability if email is the same', async () => {
      const { service, repository } = context;
      const sub = 1;
      const entity = makeUserEntity({ email: 'john@test.com' });
      const dto = makeUpdateUserDto({ email: 'john@test.com' });
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(entity);
      await service.update(sub, dto);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(repository.update).toHaveBeenCalledWith(entity.id, dto);
    });

    it('should throw conflict exception when email is already in use', async () => {
      const { service, repository } = context;
      const sub = 1;
      const entity = makeUserEntity();
      const dto = makeUpdateUserDto({ email: 'john@test.com' });
      jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(entity)
        .mockResolvedValueOnce(makeUserEntity());
      await expect(service.update(sub, dto)).rejects.toThrow(ConflictException);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should hash password before updating when password is provided', async () => {
      const { service, repository, cryptography } = context;
      const sub = 1;
      const dto = makeUpdateUserDto({ password: '@JohnDoe123' });
      const entity = makeUserEntity();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(entity);
      jest.spyOn(cryptography, 'hash').mockResolvedValue('');
      await service.update(sub, dto);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(cryptography.hash).toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledWith(entity.id, {
        ...dto,
        password: expect.not.stringContaining('@JohnDoe123'),
      });
    });

    it('should throw a not found exception when user does not exist', async () => {
      const { service, repository } = context;
      const sub = 0;
      const dto = makeUpdateUserDto();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      await expect(service.update(sub, dto)).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const { service, repository } = context;
      const sub = 1;
      const entity = makeUserEntity();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(entity);
      await service.delete(sub);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(repository.delete).toHaveBeenCalledWith(entity.id);
    });

    it('should throw a not found exception when user does not exist', async () => {
      const { service, repository } = context;
      const sub = 0;
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      await expect(service.delete(sub)).rejects.toThrow(NotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  describe('uploadPicture', () => {
    it('should save the picture and update the user', async () => {
      const { service, repository } = context;
      const sub = 1;
      const picture = makePicture();
      const entity = makeUserEntity();
      const uuid = '12b9d641-4d72-4a1e-82e1-1f911550b18a';

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(entity);
      (randomUUID as jest.Mock).mockReturnValue(uuid);

      await service.uploadPicture(sub, picture);
      expect(randomUUID).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          picture: expect.any(String),
        }),
      );
    });

    it('should throw a not found exception when user does not exist', async () => {
      const { service, repository } = context;
      const sub = 0;
      const picture = makePicture();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      await expect(service.uploadPicture(sub, picture)).rejects.toThrow(
        NotFoundException,
      );
      expect(randomUUID).not.toHaveBeenCalled();
      expect(fs.writeFile).not.toHaveBeenCalledWith();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('grantPolicies', () => {
    it('should merge current and new policies without duplicates and save user', async () => {
      const { service, repository } = context;
      const sub = 1;
      const dto = makePoliciesDto();
      const entity = makeUserEntity({
        policies: [RoutePolicies.MESSAGE_FIND_ALL],
      });
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(entity);
      jest.spyOn(repository, 'save').mockResolvedValue(entity);
      await service.grantPolicies(sub, dto);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          policies: expect.arrayContaining([
            RoutePolicies.MESSAGE_FIND_ALL,
            RoutePolicies.USER_FIND_ALL,
          ]),
        }),
      );
    });

    it('should throw a not found exception when user does not exist', async () => {
      const { service, repository } = context;
      const sub = 0;
      const dto = makePoliciesDto();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      await expect(service.grantPolicies(sub, dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});
