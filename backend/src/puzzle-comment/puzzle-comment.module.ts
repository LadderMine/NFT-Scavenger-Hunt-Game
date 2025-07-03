import { Module } from '@nestjs/common';
import { PuzzleCommentService } from './puzzle-comment.service';
import { PuzzleCommentController } from './puzzle-comment.controller';

@Module({
  providers: [PuzzleCommentService],
  controllers: [PuzzleCommentController],
  exports: [PuzzleCommentService],
})
export class PuzzleCommentModule {}
