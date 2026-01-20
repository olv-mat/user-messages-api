import { CreateUserDto } from '../../dtos/CreateUser.dto';

export const makeCreateUserDto = (
  override?: Partial<CreateUserDto>,
): CreateUserDto => {
  const dto = new CreateUserDto();
  Object.assign(dto, {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: '@JohnDoe123',
    ...override,
  });
  return dto;
};
