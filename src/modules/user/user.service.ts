import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterRootUserDto } from 'src/modules/auth/dtos/RegisterRootUser.dto';
import { Repository } from 'typeorm';
import { CryptographyService } from '../../common/modules/cryptography/cryptography.service';
import { RegisterDto } from '../auth/dtos/Register.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { PoliciesDto } from './dtos/UpddatePolicies.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly cryptographyService: CryptographyService,
  ) {}

  public findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  public findOne(sub: number): Promise<UserEntity> {
    return this.getUserById(sub);
  }

  public async create(
    dto: RegisterDto | RegisterRootUserDto,
  ): Promise<UserEntity> {
    await this.assertEmailIsAvailable(dto.email);
    return this.usersRepository.save({
      ...dto,
      password: await this.cryptographyService.hash(dto.password),
    });
  }

  public async update(sub: number, dto: UpdateUserDto): Promise<void> {
    const userEntity = await this.getUserById(sub);
    const payload: Partial<UserEntity> = { ...dto };

    if (payload.email && payload.email != userEntity.email) {
      await this.assertEmailIsAvailable(payload.email);
    }

    if (payload.password) {
      payload.password = await this.cryptographyService.hash(payload.password);
    }

    await this.usersRepository.update(userEntity.id, payload);
  }

  public async grantPolicies(id: number, dto: PoliciesDto): Promise<void> {
    const userEntity = await this.getUserById(id);
    const currentPolicies = Array.isArray(userEntity.policies)
      ? userEntity.policies
      : [];
    userEntity.policies = Array.from(
      new Set([...currentPolicies, ...dto.policies]),
    );
    await this.usersRepository.save(userEntity);
  }

  public async delete(sub: number): Promise<void> {
    const userEntity = await this.getUserById(sub);
    await this.usersRepository.delete(userEntity.id);
  }

  public async getUserByEmail(email: string): Promise<UserEntity | null> {
    const userEntity = await this.usersRepository.findOne({
      where: { email: email },
    });
    return userEntity;
  }

  private async getUserById(id: number): Promise<UserEntity> {
    const userEntity = await this.usersRepository.findOneBy({ id: id });
    if (!userEntity) throw new NotFoundException('User not found');
    return userEntity;
  }

  private async assertEmailIsAvailable(email: string): Promise<void> {
    const userEntity = await this.usersRepository.findOneBy({ email: email });
    if (userEntity) throw new ConflictException('Email already in use');
  }
}
