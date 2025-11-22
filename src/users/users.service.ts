import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserResponseDto } from './dtos/UserResponse.dto';
import { UserEntity } from './entities/user.entity';
import { UserResponseMapper } from './mappers/user-response.mapper';

/* 
  npm install bcrypt
  npm install --D @types/bcrypt 
*/

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public async findAll(): Promise<UserResponseDto | UserResponseDto[]> {
    const users = await this.usersRepository.find();
    return UserResponseMapper.toResponse(users);
  }

  public async findOne(
    id: number,
  ): Promise<UserResponseDto | UserResponseDto[]> {
    const user = await this.getUserById(id);
    return UserResponseMapper.toResponse(user);
  }

  public async create(dto: CreateUserDto): Promise<DefaultResponseDto> {
    await this.assertEmailIsAvailable(dto.email);
    const user = await this.usersRepository.save({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    });
    return ResponseMapper.toAResponse(user.id, 'User created successfully');
  }

  public async update(
    id: number,
    dto: UpdateUserDto,
  ): Promise<DefaultResponseDto> {
    const user = await this.getUserById(id);
    const payload: Partial<UserEntity> = { ...dto };

    if (payload.email && payload.email != user.email) {
      await this.assertEmailIsAvailable(payload.email);
    }

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    await this.usersRepository.update(user.id, payload);
    return ResponseMapper.toAResponse(user.id, 'User updated successfully');
  }

  public async delete(id: number): Promise<DefaultResponseDto> {
    const user = await this.getUserById(id);
    await this.usersRepository.delete(user.id);
    return ResponseMapper.toAResponse(user.id, 'User deleted successfully');
  }

  private async assertEmailIsAvailable(email: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ email: email });
    if (user) throw new ConflictException('Email already in use');
  }

  public async getUserById(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
