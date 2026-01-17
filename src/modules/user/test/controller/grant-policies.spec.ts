import { DefaultMessageResponseDto } from 'src/common/dtos/DefaultMessageResponse.dto';
import { makePoliciesDto } from 'src/common/tests/factories/policies-dto.factory';
import { UserControllerTestContext } from '../types/user-controller-tes-context.type';
import { createUserControllerTestSetup } from '../utils/create-user-controller-test-setup';

describe('UserController', () => {
  let context: UserControllerTestContext;
  beforeEach(() => {
    context = createUserControllerTestSetup();
  });

  describe('grantPolicies', () => {
    it('should call the service passing the correct arguments and return mapped response', async () => {
      const { userController, userService } = context;
      const sub = 1;
      const dto = makePoliciesDto();
      userService.grantPolicies.mockResolvedValue(undefined);
      const result = await userController.grantPolicies(sub, dto);
      expect(userService.grantPolicies).toHaveBeenCalledWith(sub, dto);
      expect(result).toBeInstanceOf(DefaultMessageResponseDto);
    });
  });
});
