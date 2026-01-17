/* eslint-disable @typescript-eslint/unbound-method */
import { ConflictException } from '@nestjs/common';
import { makeRegisterDto } from 'src/common/tests/factories/register-dto.factory';
import { makeUserEntity } from 'src/common/tests/factories/user-entity.factory';
import { mockUserFound } from '../helpers/mock-user-found.helper';
import { mockUserNotFound } from '../helpers/mock-user-not-found.helper';
import { UserServiceTestContext } from '../types/user-service-test-context.type';
import { createUserServiceTestModule } from '../utils/create-user-service-test-module';

describe('UserService', () => {
  let context: UserServiceTestContext;
  beforeEach(async () => {
    jest.clearAllMocks();
    context = await createUserServiceTestModule();
  });

  describe('create', () => {
    it('should create a user if the email is available', async () => {
      const { userService, userRepository, cryptographyService } = context;
      const dto = makeRegisterDto();
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
      const dto = makeRegisterDto();
      mockUserFound(userRepository);
      await expect(userService.create(dto)).rejects.toThrow(ConflictException);
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });
});
