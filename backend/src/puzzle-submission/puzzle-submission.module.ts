import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuzzleSubmission } from './puzzle-submission.entity';
import { PuzzleSubmissionService } from '../puzzle-submission/puzzle-submission.service';
import { PuzzleSubmissionController } from './puzzle-submission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PuzzleSubmission])],
  providers: [PuzzleSubmissionService],
  controllers: [PuzzleSubmissionController],
})
export class PuzzleSubmissionModule {}
