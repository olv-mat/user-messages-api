import { makeUserEntity } from 'src/common/tests/factories/user-entity.factory';
import { UserResponseDto } from '../../dtos/UserResponse.dto';
import { UserControllerTestContext } from '../types/user-controller-tes-context.type';
import { createUserControllerTestSetup } from '../utils/create-user-controller-test-setup';

describe('UserController', () => {
  let context: UserControllerTestContext;
  beforeEach(() => {
    context = createUserControllerTestSetup();
  });

  describe('findAll', () => {
    it('should call the service correctly and return mapped response', async () => {
      const { userController, userService } = context;
      const entities = [makeUserEntity()];
      userService.findAll.mockResolvedValue(entities);
      const result = await userController.findAll();
      expect(userService.findAll).toHaveBeenCalledWith();
      expect(Array.isArray(result)).toBe(true);
      expect(
        result.every((item: object) => item instanceof UserResponseDto),
      ).toBe(true);
    });
  });
});
