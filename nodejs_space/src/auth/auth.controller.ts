import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthResponseDto, MeResponseDto } from './dto/auth-response.dto';
import type { Request } from 'express';

@ApiTags('Auth')
@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<AuthResponseDto> {
    return this.authService.signup(dto);
  }

  @Post('auth/login')
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  async me(@Req() req: Request): Promise<MeResponseDto> {
    const user = req.user as { userId: number };
    return this.authService.me(user.userId);
  }
}
