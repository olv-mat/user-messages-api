import { makeUserEntity } from 'src/common/tests/factories/user-entity.factory';
import { UserResponseDto } from '../../dtos/UserResponse.dto';
import { UserControllerTestContext } from '../types/user-controller-tes-context.type';
import { createUserControllerTestSetup } from '../utils/create-user-controller-test-setup';

describe('UserController', () => {
  let context: UserControllerTestContext;
  beforeEach(() => {
    context = createUserControllerTestSetup();
  });

  describe('findOne', () => {
    it('should call the service passing the correct argument and return mapped response', async () => {
      const { userController, userService } = context;
      const sub = 1;
      const entity = makeUserEntity();
      userService.findOne.mockResolvedValue(entity);
      const result = await userController.findOne(sub);
      expect(userService.findOne).toHaveBeenCalledWith(sub);
      expect(result).toBeInstanceOf(UserResponseDto);
    });
  });
});
