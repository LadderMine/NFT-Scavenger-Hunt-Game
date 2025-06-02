import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StartPreviewDto, SubmitAnswerDto } from './dto/start-preview.dto';
import { PreviewPuzzleSession } from './entities/preview-puzzle.entity';

@Injectable()
export class PreviewPuzzleService {
  constructor(
    @InjectRepository(PreviewPuzzleSession)
    private readonly sessionRepo: Repository<PreviewPuzzleSession>,
  ) {}

  // Start a new preview session
  async startPreview(dto: StartPreviewDto) {
    const session = this.sessionRepo.create({
      creatorId: dto.creatorId,
      mockPuzzleData: dto.puzzleData,
      currentState: {
        hintsUsed: [],
        startedAt: new Date(),
      },
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // expires in 15 mins
    });

    await this.sessionRepo.save(session);
    return { sessionId: session.id };
  }

  // Get the next hint based on hintsUsed
  async getNextHint(sessionId: string) {
    const session = await this.sessionRepo.findOneBy({ id: sessionId });
    if (!session) throw new NotFoundException('Preview session not found');

    const { hints = [] } = session.mockPuzzleData;
    const { hintsUsed } = session.currentState;

    if (hintsUsed.length >= hints.length) {
      throw new BadRequestException('No more hints available');
    }

    const nextHint = hints[hintsUsed.length];
    hintsUsed.push(nextHint);
    session.currentState.hintsUsed = hintsUsed;

    await this.sessionRepo.save(session);
    return { hint: nextHint };
  }

  // Submit an answer for evaluation
  async submitAnswer(sessionId: string, dto: SubmitAnswerDto) {
    const session = await this.sessionRepo.findOneBy({ id: sessionId });
    if (!session) throw new NotFoundException('Preview session not found');

    const correctAnswer = session.mockPuzzleData.correctAnswer?.trim().toLowerCase();
    const submittedAnswer = dto.answer.trim().toLowerCase();

    const isCorrect = submittedAnswer === correctAnswer;
    return {
      correct: isCorrect,
      feedback: isCorrect ? 'Correct!' : 'Incorrect. Try again.',
    };
  }
}
