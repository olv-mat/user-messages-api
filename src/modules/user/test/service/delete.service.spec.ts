/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
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
