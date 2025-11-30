import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptographyService } from '../../common/modules/cryptography/cryptography.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly cryptographyService: CryptographyService,
  ) {}

  public findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  public findOne(id: number): Promise<UserEntity> {
    return this.getUserById(id);
  }

  public async create(dto: CreateUserDto): Promise<UserEntity> {
    await this.assertEmailIsAvailable(dto.email);
    return this.usersRepository.save({
      ...dto,
      password: await this.cryptographyService.hash(dto.password),
    });
  }

  public async update(id: number, dto: UpdateUserDto): Promise<void> {
    const user = await this.getUserById(id);
    const payload: Partial<UserEntity> = { ...dto };

    if (payload.email && payload.email != user.email) {
      await this.assertEmailIsAvailable(payload.email);
    }

    if (payload.password) {
      payload.password = await this.cryptographyService.hash(payload.password);
    }

    await this.usersRepository.update(user.id, payload);
  }

  public async delete(id: number): Promise<void> {
    const user = await this.getUserById(id);
    await this.usersRepository.delete(user.id);
  }

  private async assertEmailIsAvailable(email: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ email: email });
    if (user) throw new ConflictException('Email already in use');
  }

  private async getUserById(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
