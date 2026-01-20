/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DefaultMessageResponseDto } from 'src/common/dtos/DefaultMessageResponse.dto';
import { UserResponseDto } from '../dtos/UserResponse.dto';
import { UserController } from '../user.controller';
import { makeUserInterface } from './factories/create-user-interface.factory';
import { makePicture } from './factories/picture.factory';
import { makePoliciesDto } from './factories/policies-dto.factory';
import { makeUpdateUserDto } from './factories/update-user-dto.factory';
import { makeUserEntity } from './factories/user-entity.factory';

describe('UserController', () => {
  let userController: UserController;
  const userService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    uploadPicture: jest.fn(),
    update: jest.fn(),
    grantPolicies: jest.fn(),
    revokePolicies: jest.fn(),
    delete: jest.fn(),
  } as any;

  beforeEach(() => {
    userController = new UserController(userService);
  });

  describe('findAll', () => {
    it('should call the service correctly and return mapped response', async () => {
      userService.findAll.mockResolvedValue([]);
      const result = await userController.findAll();
      expect(userService.findAll).toHaveBeenCalledWith();
      expect(Array.isArray(result)).toBe(true);
      expect(
        result.every((item: object) => item instanceof UserResponseDto),
      ).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should call the service passing the correct argument and return mapped response', async () => {
      const sub = 1;
      const user = makeUserInterface();
      const userEntity = makeUserEntity();
      userService.findOne.mockResolvedValue(userEntity);
      const result = await userController.findOne(sub, user);
      expect(userService.findOne).toHaveBeenCalledWith(sub, user);
      expect(result).toBeInstanceOf(UserResponseDto);
    });
  });

  describe('uploadPicture', () => {
    it('should call the service passing the correct arguments and return mapped response', async () => {
      const sub = 1;
      const user = makeUserInterface();
      const picture = makePicture();
      userService.uploadPicture.mockResolvedValue(undefined);
      const result = await userController.uploadPicture(sub, picture, user);
      expect(userService.uploadPicture).toHaveBeenCalledWith(
        sub,
        picture,
        user,
      );
      expect(result).toBeInstanceOf(DefaultMessageResponseDto);
    });
  });

  describe('update', () => {
    it('should call the service passing the correct arguments and return mapped response', async () => {
      const sub = 1;
      const user = makeUserInterface();
      const dto = makeUpdateUserDto();
      userService.update.mockResolvedValue(undefined);
      const result = await userController.update(sub, dto, user);
      expect(userService.update).toHaveBeenCalledWith(sub, dto, user);
      expect(result).toBeInstanceOf(DefaultMessageResponseDto);
    });
  });

  describe('grantPolicies', () => {
    it('should call the service passing the correct arguments and return mapped response', async () => {
      const sub = 1;
      const dto = makePoliciesDto();
      userService.grantPolicies.mockResolvedValue(undefined);
      const result = await userController.grantPolicies(sub, dto);
      expect(userService.grantPolicies).toHaveBeenCalledWith(sub, dto);
      expect(result).toBeInstanceOf(DefaultMessageResponseDto);
    });
  });

  describe('revokePolicies', () => {
    it('should call the service passing the correct arguments and return mapped response', async () => {
      const sub = 1;
      const dto = makePoliciesDto();
      userService.revokePolicies.mockResolvedValue(undefined);
      const result = await userController.revokePolicies(sub, dto);
      expect(userService.revokePolicies).toHaveBeenCalledWith(sub, dto);
      expect(result).toBeInstanceOf(DefaultMessageResponseDto);
    });
  });

  describe('delete', () => {
    it('should call the service passing the correct argument and return mapped response', async () => {
      const sub = 1;
      const user = makeUserInterface();
      userService.delete.mockResolvedValue(undefined);
      const result = await userController.delete(sub, user);
      expect(userService.delete).toHaveBeenCalledWith(sub, user);
      expect(result).toBeInstanceOf(DefaultMessageResponseDto);
    });
  });
});
