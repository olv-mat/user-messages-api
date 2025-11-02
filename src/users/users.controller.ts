import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }
}
