import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PuzzleSubmissionService } from './puzzle-submission.service';
import { RateLimit } from 'src/rate-limiter/rate-limit.decorator';
import { RateLimitGuard } from 'src/rate-limiter/rate-limit.guard';

@Controller('puzzle-submission')
export class PuzzleSubmissionController {
  constructor(private readonly submissionService: PuzzleSubmissionService) {}

  @Post()
  @UseGuards(RateLimitGuard)
  @RateLimit({ ttl: 60, limit: 5 })
  async submit(
    @Body()
    body: {
      playerId: string;
      puzzleId: string;
      answer: string;
      correctAnswer: string;
    },
  ) {
    const { playerId, puzzleId, answer, correctAnswer } = body;
    const result = await this.submissionService.submitAnswer(
      playerId,
      puzzleId,
      answer,
      correctAnswer,
    );
    return result;
  }
}
