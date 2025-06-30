import { Controller, Post, Body } from '@nestjs/common';
import { PuzzleSubmissionService } from './puzzle-submission.service';

@Controller('puzzle-submission')
export class PuzzleSubmissionController {
  constructor(private readonly submissionService: PuzzleSubmissionService) {}

  @Post()
  async submit(@Body() body: { playerId: string; puzzleId: string; answer: string; correctAnswer: string }) {
    // correctAnswer should be provided by the frontend or fetched from a puzzle service in a real app
    const { playerId, puzzleId, answer, correctAnswer } = body;
    const result = await this.submissionService.submitAnswer(playerId, puzzleId, answer, correctAnswer);
    return result;
  }
}
