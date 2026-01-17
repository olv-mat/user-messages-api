import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserInterface } from '../../../common/interfaces/user.interface';
import { CredentialService } from '../../../common/modules/credential/credential.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly credentialService: CredentialService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('Missing authentication token');
    const payload = await this.credentialService.verify<UserInterface>(token);
    (request as Request & { user?: UserInterface }).user = payload;
    return true;
  }
}
