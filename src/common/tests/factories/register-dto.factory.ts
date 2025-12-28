import { RegisterDto } from 'src/modules/auth/dtos/Register.dto';

export const makeRegisterDto = (
  override?: Partial<RegisterDto>,
): RegisterDto => ({
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: '@JohnDoe123',
  ...override,
});
