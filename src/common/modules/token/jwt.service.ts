import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Injectable()
export class JwtServiceImplementation implements TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public sign(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  public verify<T extends object>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token);
  }

  public refresh(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: parseInt(this.configService.getOrThrow('JWT_REFRESH_TTL')),
    });
  }
}
