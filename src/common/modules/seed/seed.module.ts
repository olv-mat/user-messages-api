import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { RegisterRootUserSeed } from './register-root-user.seed';

@Module({
  imports: [UserModule],
  providers: [RegisterRootUserSeed],
  exports: [RegisterRootUserSeed],
})
export class SeedModule {}
