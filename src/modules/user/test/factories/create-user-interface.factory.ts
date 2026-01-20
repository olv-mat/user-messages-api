import { UserInterface } from 'src/common/interfaces/user.interface';

export const makeUserInterface = (
  override?: Partial<UserInterface>,
): UserInterface => {
  return {
    sub: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    ...override,
  } as UserInterface;
};
