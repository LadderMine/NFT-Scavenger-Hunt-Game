import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuzzleForkService } from './puzzle-fork.service';
import { PuzzleForkController } from './puzzle-fork.controller';
import { ForkedPuzzle } from './entities/forked-puzzle.entity';
import { PuzzleVersion } from '../puzzle-versioning/entities/puzzle-version.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ForkedPuzzle, PuzzleVersion]),
  ],
  controllers: [PuzzleForkController],
  providers: [PuzzleForkService],
})
export class PuzzleForkModule {}