import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoutePolicies } from 'src/modules/auth/enums/route-policies.enum';
import { UserService } from 'src/modules/user/user.service';
import { RegisterRootUserDto } from '../../../modules/auth/dtos/RegisterRootUser.dto';

@Injectable()
export class RegisterRootUserSeed {
  private readonly logger = new Logger(RegisterRootUserSeed.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  public async run(): Promise<void> {
    const email = this.getCredential('ROOT_USER_EMAIL');
    const exists = await this.userService.getUserByEmail(email);
    if (exists) {
      this.logger.warn('The root user already exists');
      return;
    }
    const name = this.getCredential('ROOT_USER_NAME');
    const password = this.getCredential('ROOT_USER_PASSWORD');
    const policies = [
      RoutePolicies.POLICIES_GRANT,
      RoutePolicies.POLICIES_REVOKE,
    ];
    await this.userService.create(
      new RegisterRootUserDto(name, email, password, policies),
    );
    this.logger.log('Root user created successfully');
  }

  private getCredential(credential: string) {
    return this.configService.getOrThrow<string>(credential);
  }
}
