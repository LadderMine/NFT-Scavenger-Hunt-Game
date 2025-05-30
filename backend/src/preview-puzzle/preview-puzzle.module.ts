import { Module } from '@nestjs/common';
import { PreviewPuzzleService } from './preview-puzzle.service';
import { PreviewPuzzleController } from './preview-puzzle.controller';

@Module({
  controllers: [PreviewPuzzleController],
  providers: [PreviewPuzzleService],
  exports: [PreviewPuzzleService],
})
export class PreviewPuzzleModule {}
