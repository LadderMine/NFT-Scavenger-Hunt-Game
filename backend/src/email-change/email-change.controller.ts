// email-change.controller.ts
import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { EmailChangeService } from './email-change.service';

@Controller('email-change')
export class EmailChangeController {
  constructor(private readonly emailChangeService: EmailChangeService) {}

  @Post('request')
  async requestEmailChange(@Body() body: { userId: string; newEmail: string }) {
    const { userId, newEmail } = body;
    return this.emailChangeService.requestEmailChange(userId, newEmail);
  }

  @Get('verify')
  async verifyEmailChange(@Query('token') token: string) {
    return this.emailChangeService.verifyEmailChange(token);
  }
}
