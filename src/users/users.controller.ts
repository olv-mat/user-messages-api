import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ActionResponseDto } from 'src/common/dtos/ActionResponse.dto';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { CacheIntercepotor } from 'src/common/interceptors/cache.interceptor';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseInterceptors(CacheIntercepotor)
  public findAll(): Promise<UserEntity | UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: number): Promise<UserEntity | UserEntity[]> {
    return this.usersService.findOne(id);
  }

  @Post()
  public create(@Body() dto: CreateUserDto): Promise<ActionResponseDto> {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  public update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<MessageResponseDto> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  public delete(@Param('id') id: number): Promise<MessageResponseDto> {
    return this.usersService.delete(id);
  }
}
