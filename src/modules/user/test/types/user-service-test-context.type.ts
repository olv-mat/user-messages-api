import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { UserService } from '../../user.service';

export type UserServiceTestContext = {
  userService: UserService;
  userRepository: Repository<UserEntity>;
  cryptographyService: CryptographyService;
};
