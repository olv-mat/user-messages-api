import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/request-payload.decorator';
import { DefaultMessageResponseDto } from 'src/common/dtos/DefaultMessageResponse.dto';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserResponseDto } from './dtos/UserResponse.dto';
import { UserResponseMapper } from './mappers/user-response.mapper';
import { UserService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async findAll(): Promise<UserResponseDto[]> {
    const userEntities = await this.userService.findAll();
    return UserResponseMapper.toResponseMany(userEntities);
  }

  @Get('/me')
  public async findOne(
    @CurrentUser('sub') sub: number,
  ): Promise<UserResponseDto> {
    const userEntity = await this.userService.findOne(sub);
    return UserResponseMapper.toResponseOne(userEntity);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<DefaultMessageResponseDto> {
    await this.userService.update(id, dto);
    return ResponseMapper.toResponse(
      DefaultMessageResponseDto,
      'User updated successfully',
    );
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: number,
  ): Promise<DefaultMessageResponseDto> {
    await this.userService.delete(id);
    return ResponseMapper.toResponse(
      DefaultMessageResponseDto,
      'User deleted successfully',
    );
  }
}
