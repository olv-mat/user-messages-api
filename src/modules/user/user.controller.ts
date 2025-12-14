import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SetRoutePolicy } from 'src/common/decorators/set-route-policy.decorator';
import { DefaultMessageResponseDto } from 'src/common/dtos/DefaultMessageResponse.dto';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
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
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SetRoutePolicy(RoutePolicies.USER_FIND_ALL)
  @UseGuards(PoliciesGuard)
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

  @Patch('/me')
  public async update(
    @CurrentUser('sub') sub: number,
    @Body() dto: UpdateUserDto,
  ): Promise<DefaultMessageResponseDto> {
    await this.userService.update(sub, dto);
    return ResponseMapper.toResponse(
      DefaultMessageResponseDto,
      'User updated successfully',
    );
  }

  @Patch(':id/policies/grant')
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

  @Delete('/me')
  public async delete(
    @CurrentUser('sub') sub: number,
  ): Promise<DefaultMessageResponseDto> {
    await this.userService.delete(sub);
    return ResponseMapper.toResponse(
      DefaultMessageResponseDto,
      'User deleted successfully',
    );
  }
}
