import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { TokenService } from 'src/common/modules/token/token.service';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/Login.dto';
import { LoginResponseDto } from './dtos/LoginResponse.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptographyService: CryptographyService,
    private readonly tokenService: TokenService,
  ) {}

  public async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.getUserByEmail(dto.email);
    const isValid =
      user &&
      (await this.cryptographyService.compare(dto.password, user.password));
    if (!isValid) throw new UnauthorizedException('Invalid credentials');
    const token = await this.generateToken(user);
    return ResponseMapper.toResponse(LoginResponseDto, token);
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
