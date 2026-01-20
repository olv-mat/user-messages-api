/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { RoutePolicies } from 'src/modules/auth/enums/route-policies.enum';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../user.service';
import { makeCreateUserDto } from './factories/create-user-dto.factory';
import { makePicture } from './factories/picture.factory';
import { makePoliciesDto } from './factories/policies-dto.factory';
import { makeUpdateUserDto } from './factories/update-user-dto.factory';
import { makeUserEntity } from './factories/user-entity.factory';

type UserServiceTestContext = {
  userService: UserService;
  userRepository: Repository<UserEntity>;
  cryptographyService: CryptographyService;
};

jest.mock('fs/promises');

describe('UserService', () => {
  let context: UserServiceTestContext;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: CryptographyService,
          useValue: { hash: jest.fn(), compare: jest.fn() },
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
    it('should create a user if the email is available', async () => {
      const { userService, userRepository, cryptographyService } = context;
      const dto = makeCreateUserDto();
      const entity = makeUserEntity();
      mockUserNotFound(userRepository);
      jest.spyOn(cryptographyService, 'hash').mockResolvedValue('');
      jest.spyOn(userRepository, 'save').mockResolvedValue(entity);
      const result = await userService.create(dto);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(cryptographyService.hash).toHaveBeenCalledWith(dto.password);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...dto,
        password: '',
      });
      expect(result).toEqual(entity);
    });

    it('should throw a conflict exception if the email is unavailable', async () => {
      const { userService, userRepository } = context;
      const dto = makeCreateUserDto();
      mockUserFound(userRepository);
      await expect(userService.create(dto)).rejects.toThrow(ConflictException);
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const { userService, userRepository } = context;
      const userEntities = mockUsersFound(userRepository);
      const result = await userService.findAll();
      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toEqual(userEntities);
    });
  });

  describe('findOne', () => {
    it('should return a specific user', async () => {
      const { userService, userRepository } = context;
      const sub = 1;
      const userEntity = mockUserFound(userRepository);
      const result = await userService.findOne(sub);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(result).toEqual(userEntity);
    });

    it('should throw a not found exception if the user does not exist', async () => {
      const { userService, userRepository } = context;
      const sub = 0;
      mockUserNotFound(userRepository);
      await expect(userService.findOne(sub)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: sub });
    });
  });

  describe('uploadPicture', () => {
    it('should save the picture and update the user', async () => {
      const { userService, userRepository } = context;
      const sub = 1;
      const picture = makePicture();
      mockUserFound(userRepository);
      await userService.uploadPicture(sub, picture);
      expect(fs.writeFile).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          picture: expect.any(String),
        }),
      );
    });

    it('should throw a not found exception when user does not exist', async () => {
      const { userService, userRepository } = context;
      const sub = 0;
      const picture = makePicture();
      mockUserNotFound(userRepository);
      await expect(userService.uploadPicture(sub, picture)).rejects.toThrow(
        NotFoundException,
      );
      expect(fs.writeFile).not.toHaveBeenCalledWith();
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update user without checking email or hashing password', async () => {
      const { userService, userRepository, cryptographyService } = context;
      const sub = 1;
      const dto = makeUpdateUserDto();
      const entity = mockUserFound(userRepository);
      await userService.update(sub, dto);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(cryptographyService.hash).not.toHaveBeenCalled();
      expect(userRepository.update).toHaveBeenCalledWith(entity.id, dto);
    });

    it('should check email availability when email is changed', async () => {
      const { userService, userRepository } = context;
      const sub = 1;
      const dto = makeUpdateUserDto({ email: 'john.doe@test.com' });
      const entity = makeUserEntity();
      mockUserLookupSequence(userRepository, [entity, null]);
      await userService.update(sub, dto);
      expect(userRepository.findOneBy).toHaveBeenCalledTimes(2);
      expect(userRepository.update).toHaveBeenCalledWith(entity.id, dto);
    });

    it('should not check email availability if email is the same', async () => {
      const { userService, userRepository } = context;
      const sub = 1;
      const dto = makeUpdateUserDto({ email: 'john@test.com' });
      const entity = mockUserFound(userRepository, { email: 'john@test.com' });
      await userService.update(sub, dto);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(userRepository.update).toHaveBeenCalledWith(entity.id, dto);
    });

    it('should throw conflict exception when email is already in use', async () => {
      const { userService, userRepository } = context;
      const sub = 1;
      const entity = makeUserEntity();
      const dto = makeUpdateUserDto({ email: 'john@test.com' });
      mockUserLookupSequence(userRepository, [entity, makeUserEntity()]);
      await expect(userService.update(sub, dto)).rejects.toThrow(
        ConflictException,
      );
      expect(userRepository.update).not.toHaveBeenCalled();
    });

    it('should hash password before updating when password is provided', async () => {
      const { userService, userRepository, cryptographyService } = context;
      const sub = 1;
      const dto = makeUpdateUserDto({ password: '@JohnDoe123' });
      const entity = mockUserFound(userRepository);
      jest.spyOn(cryptographyService, 'hash').mockResolvedValue('');
      await userService.update(sub, dto);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(cryptographyService.hash).toHaveBeenCalled();
      expect(userRepository.update).toHaveBeenCalledWith(entity.id, {
        ...dto,
        password: expect.not.stringContaining('@JohnDoe123'),
      });
    });

    it('should throw a not found exception when user does not exist', async () => {
      const { userService, userRepository } = context;
      const sub = 0;
      const dto = makeUpdateUserDto();
      mockUserNotFound(userRepository);
      await expect(userService.update(sub, dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('grantPolicies', () => {
    it('should grant user policies correctly', async () => {
      const { userService, userRepository } = context;
      const sub = 1;
      const dto = makePoliciesDto();
      mockUserFound(userRepository, {
        policies: [RoutePolicies.MESSAGE_FIND_ALL],
      });
      await userService.grantPolicies(sub, dto);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          policies: expect.arrayContaining([
            RoutePolicies.MESSAGE_FIND_ALL,
            RoutePolicies.USER_FIND_ALL,
          ]),
        }),
      );
    });

    it('should throw a not found exception when user does not exist', async () => {
      const { userService, userRepository } = context;
      const sub = 0;
      const dto = makePoliciesDto();
      mockUserNotFound(userRepository);
      await expect(userService.grantPolicies(sub, dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('revokePolicies', () => {
    it('should revoke user policies correctly', async () => {
      const { userService, userRepository } = context;
      const sub = 1;
      const dto = makePoliciesDto();
      mockUserFound(userRepository, {
        policies: [RoutePolicies.USER_FIND_ALL, RoutePolicies.MESSAGE_FIND_ALL],
      });
      await userService.revokePolicies(sub, dto);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          policies: [RoutePolicies.MESSAGE_FIND_ALL],
        }),
      );
    });

    it('should throw a not found exception when user does not exist', async () => {
      const { userService, userRepository } = context;
      const sub = 0;
      const dto = makePoliciesDto();
      mockUserNotFound(userRepository);
      await expect(userService.revokePolicies(sub, dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const { userService, userRepository } = context;
      const sub = 1;
      const entity = mockUserFound(userRepository);
      await userService.delete(sub);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: sub });
      expect(userRepository.delete).toHaveBeenCalledWith(entity.id);
    });

    it('should throw a not found exception when user does not exist', async () => {
      const { userService, userRepository } = context;
      const sub = 0;
      mockUserNotFound(userRepository);
      await expect(userService.delete(sub)).rejects.toThrow(NotFoundException);
      expect(userRepository.delete).not.toHaveBeenCalled();
    });
  });
});

const mockUsersFound = (
  repository: Repository<UserEntity>,
  entities: UserEntity[] = [makeUserEntity()],
): UserEntity[] => {
  jest.spyOn(repository, 'find').mockResolvedValue(entities);
  return entities;
};

const mockUserFound = (
  repository: Repository<UserEntity>,
  override?: Partial<UserEntity>,
): UserEntity => {
  const entity = makeUserEntity(override);
  jest.spyOn(repository, 'findOneBy').mockResolvedValue(entity);
  return entity;
};

const mockUserNotFound = (repository: Repository<UserEntity>): void => {
  jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
};

const mockUserLookupSequence = (
  repository: Repository<UserEntity>,
  results: Array<UserEntity | null>,
): void => {
  const spy = jest.spyOn(repository, 'findOneBy');
  results.forEach((result) => {
    spy.mockResolvedValueOnce(result);
  });
};
