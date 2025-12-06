import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { TokenService } from 'src/common/modules/token/token.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/Login.dto';
import { RegisterDto } from './dtos/Register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly cryptographyService: CryptographyService,
    private readonly tokenService: TokenService,
  ) {}

  public async login(dto: LoginDto): Promise<{
    userEntity: UserEntity;
    token: string;
  }> {
    const userEntity = await this.userService.getUserByEmail(dto.email);
    const isValid =
      userEntity &&
      (await this.cryptographyService.compare(
        dto.password,
        userEntity.password,
      ));
    if (!isValid) throw new UnauthorizedException('Invalid credentials');
    const token = await this.generateToken(userEntity);
    return { userEntity, token };
  }

  public async register(dto: RegisterDto): Promise<{
    userEntity: UserEntity;
    token: string;
  }> {
    const userEntity = await this.userService.create(dto);
    const token = await this.generateToken(userEntity);
    return { userEntity, token };
  }

  private async generateToken(user: UserEntity): Promise<string> {
    const payload: UserInterface = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };
    return await this.tokenService.sign(payload);
  }
}
