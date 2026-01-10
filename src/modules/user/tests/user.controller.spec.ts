/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { DefaultMessageResponseDto } from 'src/common/dtos/DefaultMessageResponse.dto';
import { makePicture } from 'src/common/tests/factories/picture.factory';
import { makePoliciesDto } from 'src/common/tests/factories/policies-dto.factory';
import { makeUpdateUserDto } from 'src/common/tests/factories/update-user-dto.factory';
import { makeUserEntity } from 'src/common/tests/factories/user-entity.factory';
import { UserResponseDto } from '../dtos/UserResponse.dto';
import { UserController } from '../user.controller';

describe('UserController', () => {
  let controller: UserController;
  const service = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    uploadPicture: jest.fn(),
    update: jest.fn(),
    grantPolicies: jest.fn(),
    revokePolicies: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new UserController(service as any);
  });

  describe('findAll', () => {
    it('should call the service correctly and return mapped response', async () => {
      const entities = [makeUserEntity()];
      service.findAll.mockResolvedValue(entities);
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalledWith();
      expect(Array.isArray(result)).toBe(true);
      expect(result.every((item) => item instanceof UserResponseDto)).toBe(
        true,
      );
    });
  });

  describe('findOne', () => {
    it('should call the service passing the correct argument and return mapped response', async () => {
      const sub = 1;
      const entity = makeUserEntity();
      service.findOne.mockResolvedValue(entity);
      const result = await controller.findOne(sub);
      expect(service.findOne).toHaveBeenCalledWith(sub);
      expect(result).toBeInstanceOf(UserResponseDto);
    });
  });

  describe('uploadPicture', () => {
    it('should call the service passing the correct arguments and return mapped response', async () => {
      const sub = 1;
      const picture = makePicture();
      service.uploadPicture.mockResolvedValue(undefined);
      const result = await controller.uploadPicture(sub, picture);
      expect(service.uploadPicture).toHaveBeenCalledWith(sub, picture);
      expect(result).toBeInstanceOf(DefaultMessageResponseDto);
    });
  });

  describe('update', () => {
    it('should call the service passing the correct arguments and return mapped response', async () => {
      const sub = 1;
      const dto = makeUpdateUserDto();
      service.update.mockResolvedValue(undefined);
      const result = await controller.update(sub, dto);
      expect(service.update).toHaveBeenCalledWith(sub, dto);
      expect(result).toBeInstanceOf(DefaultMessageResponseDto);
    });
  });

  describe('grantPolicies', () => {
    it('should call the service passing the correct arguments and return mapped response', async () => {
      const sub = 1;
      const dto = makePoliciesDto();
      service.grantPolicies.mockResolvedValue(undefined);
      const result = await controller.grantPolicies(sub, dto);
      expect(service.grantPolicies).toHaveBeenCalledWith(sub, dto);
      expect(result).toBeInstanceOf(DefaultMessageResponseDto);
    });
  });

  describe('revokePolicies', () => {
    it('should call the service passing the correct arguments and return mapped response', async () => {
      const sub = 1;
      const dto = makePoliciesDto();
      service.revokePolicies.mockResolvedValue(undefined);
      const result = await controller.revokePolicies(sub, dto);
      expect(service.revokePolicies).toHaveBeenCalledWith(sub, dto);
      expect(result).toBeInstanceOf(DefaultMessageResponseDto);
    });
  });

  describe('delete', () => {
    it('should call the service passing the correct argument and return mapped response', async () => {
      const sub = 1;
      service.delete.mockResolvedValue(undefined);
      const result = await controller.delete(sub);
      expect(service.delete).toHaveBeenCalledWith(sub);
      expect(result).toBeInstanceOf(DefaultMessageResponseDto);
    });
  });
});
