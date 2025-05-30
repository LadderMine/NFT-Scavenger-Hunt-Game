import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyPuzzle } from './daily-puzzle.entity';
import { Puzzles } from '../puzzles/puzzles.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DailyPuzzleService {
  private readonly logger = new Logger(DailyPuzzleService.name);

  constructor(
    @InjectRepository(DailyPuzzle)
    private readonly dailyPuzzleRepo: Repository<DailyPuzzle>,
    @InjectRepository(Puzzles)
    private readonly puzzlesRepo: Repository<Puzzles>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async rotateDailyPuzzle() {
    this.logger.log('Rotating daily puzzle...');
    await this.dailyPuzzleRepo.update({ isActive: true }, { isActive: false });
    const puzzle = await this.puzzlesRepo.createQueryBuilder('p')
      .orderBy('RANDOM()')
      .getOne();
    if (puzzle) {
      const daily = this.dailyPuzzleRepo.create({ puzzle, isActive: true });
      await this.dailyPuzzleRepo.save(daily);
      this.logger.log(`New daily puzzle set: ${puzzle.id}`);
    }
  }

  async getActiveDailyPuzzle() {
    return this.dailyPuzzleRepo.findOne({ where: { isActive: true }, relations: ['puzzle'] });
  }
}
