/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { ConflictException, NotFoundException } from '@nestjs/common';
import { makeUpdateUserDto } from 'src/common/tests/factories/update-user-dto.factory';
import { makeUserEntity } from 'src/common/tests/factories/user-entity.factory';
import { mockUserFound } from '../helpers/mock-user-found.helper';
import { mockUserLookupSequence } from '../helpers/mock-user-lookup-sequence.helper';
import { mockUserNotFound } from '../helpers/mock-user-not-found.helper';
import { UserServiceTestContext } from '../types/user-service-test-context.type';
import { createUserServiceTestModule } from '../utils/create-user-service-test-module';

describe('UserService', () => {
  let context: UserServiceTestContext;
  beforeEach(async () => {
    jest.clearAllMocks();
    context = await createUserServiceTestModule();
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
});
