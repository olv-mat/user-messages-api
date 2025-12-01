import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CryptographyModule } from 'src/common/modules/cryptography/cryptography.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// npm i @nestjs/jwt

@Module({
  imports: [
    UsersModule,
    CryptographyModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          audience: config.get('JWT_AUDIENCE'),
          issuer: config.get('JWT_ISSUER'),
          expiresIn: config.get('JWT_TTL'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
