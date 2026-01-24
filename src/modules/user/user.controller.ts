import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PictureUpload } from 'src/common/decorators/picture-upload.decorator';
import { SetRoutePolicy } from 'src/common/decorators/set-route-policy.decorator';
import { DefaultMessageResponseDto } from 'src/common/dtos/DefaultMessageResponse.dto';
import type { UserInterface } from 'src/common/interfaces/user.interface';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { UserIdParam } from 'src/common/swagger/decorators/user-id-param.decorator';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RoutePolicies } from '../auth/enums/route-policies.enum';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { PoliciesDto } from './dtos/UpddatePolicies.dto';
import { UserResponseDto } from './dtos/UserResponse.dto';
import { UserResponseMapper } from './mappers/user-response.mapper';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @SetRoutePolicy(RoutePolicies.USER_FIND_ALL)
  @UseGuards(PoliciesGuard)
  public async findAll(): Promise<UserResponseDto[]> {
    const userEntities = await this.userService.findAll();
    return UserResponseMapper.toResponseMany(userEntities);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific user' })
  @UserIdParam()
  public async findOne(
    @Param('id') id: number,
    @CurrentUser() user: UserInterface,
  ): Promise<UserResponseDto> {
    const userEntity = await this.userService.findOne(id, user);
    return UserResponseMapper.toResponseOne(userEntity);
  }

  // npm i -D @types/multer
  @Post(':id/picture')
  @ApiOperation({ summary: 'Upload profile picture for a specific user' })
  @UserIdParam()
  @UseInterceptors(FileInterceptor('picture'))
  public async uploadPicture(
    @Param('id') id: number,
    @PictureUpload() picture: Express.Multer.File,
    @CurrentUser() user: UserInterface,
  ): Promise<DefaultMessageResponseDto> {
    await this.userService.uploadPicture(id, picture, user);
    return ResponseMapper.toResponse(
      DefaultMessageResponseDto,
      'Profile picture uploaded successfully',
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific user' })
  @UserIdParam()
  public async update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: UserInterface,
  ): Promise<DefaultMessageResponseDto> {
    await this.userService.update(id, dto, user);
    return ResponseMapper.toResponse(
      DefaultMessageResponseDto,
      'User updated successfully',
    );
  }

  @Patch(':id/policies/grant')
  @ApiOperation({ summary: 'Grant policies to a specific user' })
  @UserIdParam()
  @SetRoutePolicy(RoutePolicies.POLICIES_GRANT)
  @UseGuards(PoliciesGuard)
  public async grantPolicies(
    @Param('id') id: number,
    @Body() dto: PoliciesDto,
  ): Promise<DefaultMessageResponseDto> {
    await this.userService.grantPolicies(id, dto);
    return ResponseMapper.toResponse(
      DefaultMessageResponseDto,
      'Policies successfully granted',
    );
  }

  @Patch(':id/policies/revoke')
  @ApiOperation({ summary: 'Revoke policies from a specific user' })
  @UserIdParam()
  @SetRoutePolicy(RoutePolicies.POLICIES_REVOKE)
  @UseGuards(PoliciesGuard)
  public async revokePolicies(
    @Param('id') id: number,
    @Body() dto: PoliciesDto,
  ): Promise<DefaultMessageResponseDto> {
    await this.userService.revokePolicies(id, dto);
    return ResponseMapper.toResponse(
      DefaultMessageResponseDto,
      'Policies successfully revoked',
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific user' })
  @UserIdParam()
  public async delete(
    @Param('id') id: number,
    @CurrentUser() user: UserInterface,
  ): Promise<DefaultMessageResponseDto> {
    await this.userService.delete(id, user);
    return ResponseMapper.toResponse(
      DefaultMessageResponseDto,
      'User deleted successfully',
    );
  }
}
