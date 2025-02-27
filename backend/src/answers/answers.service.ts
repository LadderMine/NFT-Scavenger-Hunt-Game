import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer, Answers } from './answers.entity';
import { Puzzles } from '../puzzles/puzzles.entity';
import { User } from '../users/users.entity';
import { CheckAnswerDto } from './dto/check-answer.dto';
import { validate } from 'class-validator';
import { HintsService } from 'src/hints/hints.service';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRepository(Puzzles)
    private puzzlesRepository: Repository<Puzzles>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Answers)
    private answersRepository: Repository<Answers>,
    
    private readonly hintsService: HintsService
  ) {}

  async checkAnswer(checkAnswerDto: CheckAnswerDto): Promise<boolean> {
    const errors = await validate(checkAnswerDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const { puzzleId, userId, answer } = checkAnswerDto;

    // Find the puzzle
    const puzzle = await this.puzzlesRepository.findOne({
      where: { id: parseInt(puzzleId) },
    });
    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${puzzleId} not found`);
    }

    // Find the user
    const user = await this.usersRepository.findOne({
      where: { id: parseInt(userId) },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Store the submitted answer for the puzzle
    const newAnswer = this.answerRepository.create({
      text: answer,
      user: user,
      puzzle: puzzle,
    });
    await this.answersRepository.save(newAnswer);

    return this.validateAnswer(puzzle, answer);
  }

  private validateAnswer(puzzle: Puzzles, answer: string): boolean {
    return (
      answer.toLowerCase().trim() === puzzle.correctAnswer.toLowerCase().trim()
    );
  }
}
