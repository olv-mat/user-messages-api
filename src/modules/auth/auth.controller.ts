import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dtos/AuthResponse.dto';
import { LoginDto } from './dtos/Login.dto';
import { RegisterDto } from './dtos/Register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  public login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Post('/register')
  public register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
