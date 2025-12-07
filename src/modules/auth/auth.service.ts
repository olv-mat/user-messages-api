import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { TokenService } from 'src/common/modules/token/token.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthResponseDto } from './dtos/AuthResponse.dto';
import { LoginDto } from './dtos/Login.dto';
import { RegisterDto } from './dtos/Register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly cryptographyService: CryptographyService,
    private readonly tokenService: TokenService,
  ) {}

  public async login(dto: LoginDto): Promise<AuthResponseDto> {
    const userEntity = await this.userService.getUserByEmail(dto.email);
    const isValid =
      userEntity &&
      (await this.cryptographyService.compare(
        dto.password,
        userEntity.password,
      ));
    if (!isValid) throw new UnauthorizedException('Invalid credentials');
    return this.generateTokens(userEntity);
  }

  public async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const userEntity = await this.userService.create(dto);
    return this.generateTokens(userEntity);
  }

  private async generateTokens(user: UserEntity): Promise<AuthResponseDto> {
    const accessToken = await this.tokenService.sign({
      sub: user.id,
      name: user.name,
      email: user.email,
    });
    const refreshToken = await this.tokenService.refresh({ sub: user.id });
    return new AuthResponseDto(user.id, accessToken, refreshToken);
  }
}
