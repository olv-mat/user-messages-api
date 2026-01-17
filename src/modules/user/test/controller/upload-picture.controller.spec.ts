import { DefaultMessageResponseDto } from 'src/common/dtos/DefaultMessageResponse.dto';
import { makePicture } from 'src/common/tests/factories/picture.factory';
import { UserControllerTestContext } from '../types/user-controller-tes-context.type';
import { createUserControllerTestSetup } from '../utils/create-user-controller-test-setup';

describe('UserController', () => {
  let context: UserControllerTestContext;
  beforeEach(() => {
    context = createUserControllerTestSetup();
  });

  describe('uploadPicture', () => {
    it('should call the service passing the correct arguments and return mapped response', async () => {
      const { userController, userService } = context;
      const sub = 1;
      const picture = makePicture();
      userService.uploadPicture.mockResolvedValue(undefined);
      const result = await userController.uploadPicture(sub, picture);
      expect(userService.uploadPicture).toHaveBeenCalledWith(sub, picture);
      expect(result).toBeInstanceOf(DefaultMessageResponseDto);
    });
  });
});
