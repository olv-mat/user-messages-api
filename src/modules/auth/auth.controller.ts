import { Body, Controller, Post } from '@nestjs/common';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dtos/AuthResponse.dto';
import { LoginDto } from './dtos/Login.dto';
import { RegisterDto } from './dtos/Register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  public async login(@Body() dto: LoginDto) {
    const { userEntity, token } = await this.authService.login(dto);
    return ResponseMapper.toResponse(AuthResponseDto, userEntity.id, token);
  }

  @Post('/register')
  public async register(@Body() dto: RegisterDto) {
    const { userEntity, token } = await this.authService.register(dto);
    return ResponseMapper.toResponse(AuthResponseDto, userEntity.id, token);
  }
}
