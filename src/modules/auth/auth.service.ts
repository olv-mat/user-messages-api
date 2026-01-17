import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { CredentialService } from 'src/common/modules/credential/credential.service';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthResponseDto } from './dtos/AuthResponse.dto';
import { LoginDto } from './dtos/Login.dto';
import { RefreshTokenDto } from './dtos/RefreshToken.dto';
import { RegisterDto } from './dtos/Register.dto';

type TokenSubject = Pick<UserInterface, 'sub'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly cryptographyService: CryptographyService,
    private readonly credentialService: CredentialService,
  ) {}

  public async login(dto: LoginDto): Promise<AuthResponseDto> {
    const userEntity = await this.userService.findUserByEmail(dto.email);
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

  public async refresh(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    const { sub } = await this.credentialService.verify<TokenSubject>(
      dto.refreshToken,
    );
    const userEntity = await this.userService.findOne(sub);
    return this.generateTokens(userEntity);
  }

  private async generateTokens(user: UserEntity): Promise<AuthResponseDto> {
    const accessToken = await this.credentialService.sign({
      sub: user.id,
      name: user.name,
      email: user.email,
    });
    const refreshToken = await this.credentialService.refresh({ sub: user.id });
    return new AuthResponseDto(user.id, accessToken, refreshToken);
  }
}
