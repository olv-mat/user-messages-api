import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dtos/CreateUser.dto';

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

  public async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  public async findOne(id: number): Promise<UserEntity> {
    return await this.findUserById(id);
  }

  public async create(
    dto: CreateUserDto,
  ): Promise<{ id: number; message: string }> {
    await this.validateEmailAvailable(dto.email);
    const user = await this.usersRepository.save({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    });
    return { id: user.id, message: 'User created successfully' };
  }

  private async findUserById(id: number): Promise<UserEntity> {
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
