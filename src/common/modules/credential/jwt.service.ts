import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CredentialService } from './credential.service';

@Injectable()
export class JwtServiceImplementation implements CredentialService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public sign(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  public async verify<T extends object>(token: string): Promise<T> {
    try {
      return await this.jwtService.verifyAsync<T>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  public refresh(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: parseInt(this.configService.getOrThrow('JWT_REFRESH_TTL')),
    });
  }
}
