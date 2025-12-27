import { RegisterDto } from 'src/modules/auth/dtos/Register.dto';

export const makeRegisterDto = (
  override?: Partial<RegisterDto>,
): RegisterDto => ({
  email: '',
  name: '',
  password: '',
  ...override,
});
