import { DefaultMessageResponseDto } from 'src/common/dtos/DefaultMessageResponse.dto';
import { UserControllerTestContext } from '../types/user-controller-tes-context.type';
import { createUserControllerTestSetup } from '../utils/create-user-controller-test-setup';

describe('UserController', () => {
  let context: UserControllerTestContext;
  beforeEach(() => {
    context = createUserControllerTestSetup();
  });

  describe('delete', () => {
    it('should call the service passing the correct argument and return mapped response', async () => {
      const { userController, userService } = context;
      const sub = 1;
      userService.delete.mockResolvedValue(undefined);
      const result = await userController.delete(sub);
      expect(userService.delete).toHaveBeenCalledWith(sub);
      expect(result).toBeInstanceOf(DefaultMessageResponseDto);
    });
  });
});
