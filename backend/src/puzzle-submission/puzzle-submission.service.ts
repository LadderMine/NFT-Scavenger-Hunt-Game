import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PuzzleSubmission } from './puzzle-submission.entity';

@Injectable()
export class PuzzleSubmissionService {
  constructor(
    @InjectRepository(PuzzleSubmission)
    private readonly submissionRepo: Repository<PuzzleSubmission>,
  ) {}

  async submitAnswer(playerId: string, puzzleId: string, answer: string, correctAnswer: string) {
    // Find last submission for this player and puzzle
    let submission = await this.submissionRepo.findOne({ where: { playerId, puzzleId }, order: { attemptCount: 'DESC' } });
    let attemptCount = submission ? submission.attemptCount + 1 : 1;
    const isCorrect = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    const newSubmission = this.submissionRepo.create({
      playerId,
      puzzleId,
      answer,
      isCorrect,
      attemptCount,
    });
    await this.submissionRepo.save(newSubmission);
    return {
      isCorrect,
      attempts: attemptCount,
      feedback: isCorrect ? 'Correct answer!' : 'Incorrect answer. Try again.',
    };
  }

  async getAttempts(playerId: string, puzzleId: string): Promise<number> {
    const last = await this.submissionRepo.findOne({ where: { playerId, puzzleId }, order: { attemptCount: 'DESC' } });
    return last ? last.attemptCount : 0;
  }
}
