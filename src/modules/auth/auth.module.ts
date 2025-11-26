import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptService } from './hash/bcrypt.service';
import { HashService } from './hash/hash.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashService,
      useClass: BcryptService,
    },
  ],
  exports: [HashService],
})
export class AuthModule {}
