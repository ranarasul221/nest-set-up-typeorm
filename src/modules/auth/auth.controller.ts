import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';


@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('register')
  register(@Body() dto) {
    return this.service.register(dto);
  }

  @Post('verify')
  verify(@Body() dto) {
    return this.service.verifyOtp(dto);
  }

  @Post('login')
  login(@Body() dto) {
    return this.service.login(dto);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') token: string) {
    return this.service.refresh(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user) {
    return user;
  }
}