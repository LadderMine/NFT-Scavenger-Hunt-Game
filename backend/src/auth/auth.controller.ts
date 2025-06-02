/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Session, 
  UseGuards,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { AuthService, LoginDto } from './auth.service';
import { SessionGuard } from './guards/session.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Session() session: Record<string, any>) {
    return this.authService.login(loginDto, session);
  }

  @Post('logout')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Session() session: Record<string, any>) {
    return this.authService.logout(session);
  }

  @Get('session')
  @UseGuards(SessionGuard)
  getSession(@Session() session: Record<string, any>) {
    return this.authService.getSessionInfo(session);
  }

  @Get('profile')
  @UseGuards(SessionGuard)
  getProfile(@Session() session: Record<string, any>) {
    return {
      message: 'This is a protected route',
      user: {
        id: session.userId,
        username: session.username,
      },
    };
  }
}
