/* eslint-disable @typescript-eslint/unbound-method */
import { mockUsersFound } from '../helpers/mock-users-found.helper';
import { UserServiceTestContext } from '../types/user-service-test-context.type';
import { createUserServiceTestModule } from '../utils/create-user-service-test-module';

describe('UserService', () => {
  let context: UserServiceTestContext;
  beforeEach(async () => {
    context = await createUserServiceTestModule();
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
});
