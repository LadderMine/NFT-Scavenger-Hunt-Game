import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyPuzzle } from './daily-puzzle.entity';
import { DailyPuzzleService } from './daily-puzzle.service';
import { DailyPuzzleController } from './daily-puzzle.controller';
import { Puzzles } from '../puzzles/puzzles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyPuzzle, Puzzles])],
  providers: [DailyPuzzleService],
  controllers: [DailyPuzzleController],
  exports: [DailyPuzzleService],
})
export class DailyPuzzleModule {}
