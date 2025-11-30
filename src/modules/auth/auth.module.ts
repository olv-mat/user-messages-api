import { Module } from '@nestjs/common';
import { CryptographyModule } from 'src/common/modules/cryptography/cryptography.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, CryptographyModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
