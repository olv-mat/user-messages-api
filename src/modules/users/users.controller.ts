import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DefaultMessageResponseDto } from 'src/common/dtos/DefaultMessageResponse.dto';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserResponseDto } from './dtos/UserResponse.dto';
import { UserResponseMapper } from './mappers/user-response.mapper';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return UserResponseMapper.toResponseMany(users);
  }

  @Get(':id')
  public async findOne(@Param('id') id: number): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return UserResponseMapper.toResponseOne(user);
  }

  @Post()
  public async create(@Body() dto: CreateUserDto): Promise<DefaultResponseDto> {
    const user = await this.usersService.create(dto);
    return ResponseMapper.toResponse(
      DefaultResponseDto,
      user.id,
      'User created successfully',
    );
  }

  @Patch(':id')
  public async update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<DefaultMessageResponseDto> {
    await this.usersService.update(id, dto);
    return ResponseMapper.toResponse(
      DefaultMessageResponseDto,
      'User updated successfully',
    );
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: number,
  ): Promise<DefaultMessageResponseDto> {
    await this.usersService.delete(id);
    return ResponseMapper.toResponse(
      DefaultMessageResponseDto,
      'User deleted successfully',
    );
  }
}
