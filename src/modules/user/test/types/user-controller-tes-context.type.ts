import { UserController } from '../../user.controller';

type UserControllerServiceMock = {
  findAll: jest.Mock;
  findOne: jest.Mock;
  uploadPicture: jest.Mock;
  update: jest.Mock;
  grantPolicies: jest.Mock;
  revokePolicies: jest.Mock;
  delete: jest.Mock;
};

export type UserControllerTestContext = {
  userController: UserController;
  userService: UserControllerServiceMock;
};
