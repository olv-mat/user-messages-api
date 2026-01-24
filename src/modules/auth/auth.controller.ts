import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {
  SwaggerConflict,
  SwaggerInternalServerError,
  SwaggerNotFound,
  SwaggerUnauthorized,
} from 'src/common/swagger/responses.swagger';
import { CreateUserDto } from '../user/dtos/CreateUser.dto';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dtos/AuthResponse.dto';
import { LoginDto } from './dtos/Login.dto';
import { RefreshTokenDto } from './dtos/RefreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Authenticate user and return access token' })
  @SwaggerUnauthorized('Invalid credentials')
  @SwaggerInternalServerError()
  public login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Post('/register')
  @SwaggerConflict('Email already in use')
  @SwaggerInternalServerError()
  @ApiOperation({ summary: 'Register a new user and return access token' })
  public register(@Body() dto: CreateUserDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Post('/refresh')
  @SwaggerNotFound('User not found')
  @SwaggerInternalServerError()
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  public refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refresh(dto);
  }
}
