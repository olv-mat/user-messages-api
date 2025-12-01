import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/Login.dto';
import { LoginResponseDto } from './dtos/LoginResponse.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptographyService: CryptographyService,
    private readonly jwtService: JwtService,
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
    return await this.jwtService.signAsync({
      sub: user.id,
      name: user.name,
      email: user.email,
    });
  }
}
