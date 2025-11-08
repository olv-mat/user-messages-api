import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ActionResponseDto } from 'src/common/dtos/ActionResponse.dto';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserEntity } from './entities/user.entity';

/* 
  npm install bcrypt
  npm install --D @types/bcrypt 
*/

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly responseMapper: ResponseMapper,
  ) {}

  public async findAll(): Promise<UserEntity | UserEntity[]> {
    const users = await this.usersRepository.find();
    return this.responseMapper.toResponse(UserEntity, users);
  }

  public async findOne(id: number): Promise<UserEntity | UserEntity[]> {
    const user = await this.findUserById(id);
    return this.responseMapper.toResponse(UserEntity, user);
  }

  public async create(dto: CreateUserDto): Promise<ActionResponseDto> {
    await this.validateEmailAvailable(dto.email);
    const user = await this.usersRepository.save({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    });
    return this.responseMapper.toActionResponse(
      user.id,
      'User created successfully',
    );
  }

  public async update(
    id: number,
    dto: UpdateUserDto,
  ): Promise<MessageResponseDto> {
    const user = await this.findUserById(id);
    const payload: Partial<UserEntity> = { ...dto };

    if (payload.email && payload.email != user.email) {
      await this.validateEmailAvailable(payload.email);
    }

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    await this.usersRepository.update(user.id, payload);
    return this.responseMapper.toMessageResponse('User updated successfully');
  }

  public async delete(id: number): Promise<MessageResponseDto> {
    const user = await this.findUserById(id);
    await this.usersRepository.delete(user.id);
    return this.responseMapper.toMessageResponse('User deleted successfully');
  }

  public async findUserById(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async validateEmailAvailable(email: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ email: email });
    if (user) {
      throw new ConflictException('Email already in use');
    }
  }
}
