import { UpdateUserDto } from 'src/modules/user/dtos/UpdateUser.dto';

export const makeUpdateUserDto = (
  override?: Partial<UpdateUserDto>,
): UpdateUserDto => ({
  name: 'John',
  ...override,
});
