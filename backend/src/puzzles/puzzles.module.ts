import { Module } from '@nestjs/common';
import { PuzzlesController } from './puzzles.controller';
import { PuzzlesService } from './puzzles.service';

@Module({
  controllers: [PuzzlesController],
  providers: [PuzzlesService]
})
export class PuzzlesModule {}
