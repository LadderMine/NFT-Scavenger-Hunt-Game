import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { SessionService } from './session.service';
import { Session } from './session.entity';
import { ActivityType } from './enum/activityType.enum';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('start')
  async startSession(
    @Body('userId') userId: string,
    @Body('activityType') activityType: ActivityType,
  ): Promise<Session> {
    return this.sessionService.startSession(userId, activityType);
  }

  @Post('end/:sessionId')
  async endSession(
    @Param('sessionId') sessionId: string,
  ): Promise<Session | null> {
    return this.sessionService.endSession(sessionId);
  }

  @Get('active')
  async getActiveSessions(): Promise<Session[]> {
    return this.sessionService.getActiveSessions();
  }
}
