// cleanup/cleanup.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Puzzles } from 'src/puzzles/puzzles.entity';
import { Repository, LessThan } from 'typeorm';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    @InjectRepository(Puzzles)
    private puzzleRepo: Repository<Puzzles>,
  ) {}

  @Cron(CronExpression.EVERY_WEEK) // Runs every 7 days
  async handlePuzzleCleanup() {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 30); // 30 days ago

    const result = await this.puzzleRepo.delete({
      updatedAt: LessThan(thresholdDate),
      isTest: true,
    });

    this.logger.log(`Cleanup complete: Deleted ${result.affected} test/inactive puzzles`);
  }
}