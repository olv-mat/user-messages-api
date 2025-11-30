import { UserResponseDto } from '../dtos/UserResponse.dto';
import { UserEntity } from '../entities/user.entity';

export class UserResponseMapper {
  public static toResponseOne = (user: UserEntity) => this.toDto(user);
  public static toResponseMany = (users: UserEntity[]) => this.toDtoList(users);

  public static toDto(user: UserEntity): UserResponseDto {
    const { id, name, email } = user;
    return new UserResponseDto(id, name, email);
  }

  private static toDtoList(users: UserEntity[]): UserResponseDto[] {
    return users.map((user) => this.toDto(user));
  }
}
