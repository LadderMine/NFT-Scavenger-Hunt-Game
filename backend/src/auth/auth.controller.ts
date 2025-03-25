/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/Log-in.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() logInDto: LogInDto, @Req() req: Request) {
    return this.authService.LogIn(logInDto, req);
  }
}
