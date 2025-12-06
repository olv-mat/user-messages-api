import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { JwtModule } from '@nestjs/jwt';
import { JwtServiceImplementation } from './jwt.service';
import { TokenService } from './token.service';

// npm i @nestjs/jwt

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          audience: configService.get('JWT_AUDIENCE'),
          issuer: configService.get('JWT_ISSUER'),
          expiresIn: parseInt(configService.get('JWT_TTL')!),
        },
      }),
    }),
  ],
  providers: [
    {
      provide: TokenService,
      useClass: JwtServiceImplementation,
    },
  ],
  exports: [TokenService],
})
export class TokenModule {}
