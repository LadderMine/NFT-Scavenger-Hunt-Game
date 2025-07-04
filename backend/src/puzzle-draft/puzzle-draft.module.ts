import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftPuzzle } from './entities/draft-puzzle.entity';
import { DraftPuzzleService } from './draft-puzzle.service';
import { DraftPuzzleController } from './draft-puzzle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DraftPuzzle])],
  controllers: [DraftPuzzleController],
  providers: [DraftPuzzleService],
  exports: [],
})
export class PuzzleDraftModule {}
