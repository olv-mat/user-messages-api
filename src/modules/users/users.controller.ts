import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserResponseDto } from './dtos/UserResponse.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public findAll(): Promise<UserResponseDto | UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  public findOne(
    @Param('id') id: number,
  ): Promise<UserResponseDto | UserResponseDto[]> {
    return this.usersService.findOne(id);
  }

  @Post()
  public create(@Body() dto: CreateUserDto): Promise<DefaultResponseDto> {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  public update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<DefaultResponseDto> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  public delete(@Param('id') id: number): Promise<DefaultResponseDto> {
    return this.usersService.delete(id);
  }
}
