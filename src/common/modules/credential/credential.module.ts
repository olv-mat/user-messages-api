import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { JwtModule } from '@nestjs/jwt';
import { CredentialService } from './credential.service';
import { JwtServiceImplementation } from './jwt.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          audience: configService.getOrThrow('JWT_AUDIENCE'),
          issuer: configService.getOrThrow('JWT_ISSUER'),
          expiresIn: parseInt(configService.getOrThrow('JWT_TTL')),
        },
      }),
    }),
  ],
  providers: [
    {
      provide: CredentialService,
      useClass: JwtServiceImplementation,
    },
  ],
  exports: [CredentialService],
})
export class CredentialModule {}
