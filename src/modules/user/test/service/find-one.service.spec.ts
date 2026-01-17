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
});
