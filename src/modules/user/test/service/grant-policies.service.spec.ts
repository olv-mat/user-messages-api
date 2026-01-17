/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import { makePoliciesDto } from 'src/common/tests/factories/policies-dto.factory';
import { RoutePolicies } from 'src/modules/auth/enums/route-policies.enum';
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
});
