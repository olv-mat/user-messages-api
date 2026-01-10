import { RegisterDto } from 'src/modules/auth/dtos/Register.dto';

export const makeRegisterDto = (
  override?: Partial<RegisterDto>,
): RegisterDto => {
  const dto = new RegisterDto();
  Object.assign(dto, {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: '@JohnDoe123',
    ...override,
  });
  return dto;
};
