import { UserResponseDto } from '../dtos/UserResponse.dto';
import { UserEntity } from '../entities/user.entity';

export class UserResponseMapper {
  public static toResponseMany = (userEntities: UserEntity[]) =>
    this.toDtoList(userEntities);
  public static toResponseOne = (userEntity: UserEntity) =>
    this.toDto(userEntity);

  private static toDtoList(userEntities: UserEntity[]): UserResponseDto[] {
    return userEntities.map((userEntity) => this.toDto(userEntity));
  }

  public static toDto(userEntity: UserEntity): UserResponseDto {
    const { id, name, email } = userEntity;
    return new UserResponseDto(id, name, email);
  }
}
