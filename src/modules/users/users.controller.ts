import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/request-payload.decorator';
import { DefaultMessageResponseDto } from 'src/common/dtos/DefaultMessageResponse.dto';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserResponseDto } from './dtos/UserResponse.dto';
import { UserResponseMapper } from './mappers/user-response.mapper';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return UserResponseMapper.toResponseMany(users);
  }

  @Get('/me')
  public async findOne(
    @CurrentUser('sub') sub: number,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(sub);
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
