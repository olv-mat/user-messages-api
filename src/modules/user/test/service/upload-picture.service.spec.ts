/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import { makePicture } from 'src/common/tests/factories/picture.factory';
import { mockUserFound } from '../helpers/mock-user-found.helper';
import { mockUserNotFound } from '../helpers/mock-user-not-found.helper';
import { UserServiceTestContext } from '../types/user-service-test-context.type';
import { createUserServiceTestModule } from '../utils/create-user-service-test-module';

jest.mock('fs/promises');
jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

describe('UserService', () => {
  let context: UserServiceTestContext;
  beforeEach(async () => {
    jest.clearAllMocks();
    context = await createUserServiceTestModule();
  });

  describe('uploadPicture', () => {
    it('should save the picture and update the user', async () => {
      const { userService, userRepository } = context;
      const sub = 1;
      const picture = makePicture();
      mockUserFound(userRepository);
      const uuid = '12b9d641-4d72-4a1e-82e1-1f911550b18a';
      (randomUUID as jest.Mock).mockReturnValue(uuid);
      await userService.uploadPicture(sub, picture);
      expect(randomUUID).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          picture: expect.any(String),
        }),
      );
    });

    it('should throw a not found exception when user does not exist', async () => {
      const { userService, userRepository } = context;
      const sub = 0;
      const picture = makePicture();
      mockUserNotFound(userRepository);
      await expect(userService.uploadPicture(sub, picture)).rejects.toThrow(
        NotFoundException,
      );
      expect(randomUUID).not.toHaveBeenCalled();
      expect(fs.writeFile).not.toHaveBeenCalledWith();
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });
});
