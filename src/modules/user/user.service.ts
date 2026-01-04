import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { RegisterRootUserDto } from 'src/modules/auth/dtos/RegisterRootUser.dto';
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

  public async delete(sub: number): Promise<void> {
    const userEntity = await this.getUserById(sub);
    await this.usersRepository.delete(userEntity.id);
  }

  public async uploadPicture(
    sub: number,
    picture: Express.Multer.File,
  ): Promise<void> {
    const userEntity = await this.getUserById(sub);
    const folder = path.resolve(process.cwd(), 'pictures', sub.toString());
    await this.resetPictureFolder(folder);
    userEntity.picture = await this.savePicture(picture, folder);
    await this.usersRepository.save(userEntity);
  }

  public async grantPolicies(id: number, dto: PoliciesDto): Promise<void> {
    const { userEntity, currentPolicies } =
      await this.getUserCurrentPolicies(id);
    userEntity.policies = Array.from(
      new Set([...currentPolicies, ...dto.policies]),
    );
    await this.usersRepository.save(userEntity);
  }

  public async revokePolicies(id: number, dto: PoliciesDto): Promise<void> {
    const { userEntity, currentPolicies } =
      await this.getUserCurrentPolicies(id);
    userEntity.policies = currentPolicies.filter(
      (policy) => !dto.policies.includes(policy),
    );
    await this.usersRepository.save(userEntity);
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

  private async resetPictureFolder(folder: string): Promise<void> {
    await fs.rm(folder, { recursive: true, force: true });
    await fs.mkdir(folder, { recursive: true });
  }

  private async savePicture(
    picture: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const extension = path.extname(picture.originalname);
    const pictureName = `${randomUUID()}${extension}`;
    const fullPath = path.join(folder, pictureName);
    await fs.writeFile(fullPath, picture.buffer);
    return pictureName;
  }
}
