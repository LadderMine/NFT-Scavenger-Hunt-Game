import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Session } from './session.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ActivityType } from './enum/activityType.enum';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async startSession(
    userId: string,
    activityType: ActivityType,
  ): Promise<Session> {
    const session = this.sessionRepository.create({
      userId,
      activityType,
      startedAt: new Date(),
      endedAt: null,
    });
    return this.sessionRepository.save(session);
  }

  async endSession(sessionId: string): Promise<Session | null> {
    const session = await this.sessionRepository.findOne({
      where: { sessionId },
    });
    if (!session) return null;
    session.endedAt = new Date();
    return this.sessionRepository.save(session);
  }

  async getActiveSessions(): Promise<Session[]> {
    return this.sessionRepository.find({ where: { endedAt: null } });
  }

  // Cleanup sessions ended more than 24 hours ago (customize as needed)
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredSessions() {
    const expiryDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await this.sessionRepository.delete({
      endedAt: LessThan(expiryDate),
    });
    if (result.affected) {
      this.logger.log(`Cleaned up ${result.affected} expired sessions.`);
    }
  }
}
