/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { UserController } from '../../user.controller';
import { UserControllerTestContext } from '../types/user-controller-tes-context.type';

export function createUserControllerTestSetup(): UserControllerTestContext {
  const userService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    uploadPicture: jest.fn(),
    update: jest.fn(),
    grantPolicies: jest.fn(),
    revokePolicies: jest.fn(),
    delete: jest.fn(),
  } as any;
  const userController = new UserController(userService);
  return { userController, userService };
}
