import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CryptographyService } from './cryptography.service';

/* 
  npm install bcrypt
  npm install --D @types/bcrypt 
*/

@Injectable()
export class BcryptService extends CryptographyService {
  public async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
