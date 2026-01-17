import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { Repository } from 'typeorm';
import { CryptographyService } from '../../common/modules/cryptography/cryptography.service';
import { RegisterDto } from '../auth/dtos/Register.dto';
import { RoutePolicies } from '../auth/enums/route-policies.enum';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { PoliciesDto } from './dtos/UpddatePolicies.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly cryptographyService: CryptographyService,
  ) {}

  public findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ email: email });
  }

  public async create(dto: RegisterDto): Promise<UserEntity> {
    await this.assertEmailIsAvailable(dto.email);
    return this.userRepository.save({
      ...dto,
      password: await this.cryptographyService.hash(dto.password),
    });
  }

  public findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  public async findOne(sub: number, user?: UserInterface): Promise<UserEntity> {
    const userEntity = await this.getUserById(sub);
    if (user) this.assertOwner(userEntity, user);
    return userEntity;
  }

  public async uploadPicture(
    sub: number,
    picture: Express.Multer.File,
    user?: UserInterface,
  ): Promise<void> {
    const userEntity = await this.getUserById(sub);
    if (user) this.assertOwner(userEntity, user);
    const folder = path.resolve(process.cwd(), 'pictures');
    const extension = path.extname(picture.originalname);
    const filename = `${userEntity.id}${extension}`;
    const fullPath = path.join(folder, filename);
    await fs.writeFile(fullPath, picture.buffer);
    await this.userRepository.save({
      ...userEntity,
      picture: filename,
    });
  }

  public async update(
    sub: number,
    dto: UpdateUserDto,
    user?: UserInterface,
  ): Promise<void> {
    const userEntity = await this.getUserById(sub);
    if (user) this.assertOwner(userEntity, user);
    if (dto.email && dto.email != userEntity.email) {
      await this.assertEmailIsAvailable(dto.email);
    }
    await this.userRepository.update(userEntity.id, {
      ...dto,
      ...(dto.password && {
        password: await this.cryptographyService.hash(dto.password),
      }),
    });
  }

  public async grantPolicies(id: number, dto: PoliciesDto): Promise<void> {
    const { userEntity, currentPolicies } =
      await this.getUserCurrentPolicies(id);
    userEntity.policies = Array.from(
      new Set([...currentPolicies, ...dto.policies]),
    );
    await this.userRepository.save(userEntity);
  }

  public async revokePolicies(id: number, dto: PoliciesDto): Promise<void> {
    const { userEntity, currentPolicies } =
      await this.getUserCurrentPolicies(id);
    userEntity.policies = currentPolicies.filter(
      (policy) => !dto.policies.includes(policy),
    );
    await this.userRepository.save(userEntity);
  }

  public async delete(sub: number, user: UserInterface): Promise<void> {
    const userEntity = await this.getUserById(sub);
    if (user) this.assertOwner(userEntity, user);
    await this.userRepository.delete(userEntity.id);
  }

  private async getUserById(id: number): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOneBy({ id: id });
    if (!userEntity) throw new NotFoundException('User not found');
    return userEntity;
  }

  private assertOwner(userEntity: UserEntity, user: UserInterface): void {
    if (userEntity.id !== user.sub) {
      throw new ForbiddenException('You cannot perform this action');
    }
  }

  private async assertEmailIsAvailable(email: string): Promise<void> {
    const userEntity = await this.userRepository.findOneBy({ email: email });
    if (userEntity) throw new ConflictException('Email already in use');
  }

  private async getUserCurrentPolicies(id: number): Promise<{
    userEntity: UserEntity;
    currentPolicies: RoutePolicies[];
  }> {
    const userEntity = await this.getUserById(id);
    const currentPolicies = Array.isArray(userEntity.policies)
      ? userEntity.policies
      : [];
    return {
      userEntity,
      currentPolicies,
    };
  }
}
