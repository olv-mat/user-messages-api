import { UpdateUserDto } from '../../dtos/UpdateUser.dto';

export const makeUpdateUserDto = (
  override?: Partial<UpdateUserDto>,
): UpdateUserDto => ({
  name: 'John',
  ...override,
});
