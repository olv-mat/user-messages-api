import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

// npm i --D @nestjs/testing
describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;
  let cryptographyService: CryptographyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(UserEntity), useValue: {} },
        { provide: CryptographyService, useValue: {} },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    cryptographyService = module.get<CryptographyService>(CryptographyService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
