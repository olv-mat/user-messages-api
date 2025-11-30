import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/Login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptographyService: CryptographyService,
  ) {}

  public async login(dto: LoginDto): Promise<boolean> {
    const user = await this.usersService.getUserByEmail(dto.email);
    const isValidUser =
      user &&
      (await this.cryptographyService.compare(dto.password, user.password));
    if (!isValidUser) throw new UnauthorizedException('Invalid credentials');
    return true;
  }
}
