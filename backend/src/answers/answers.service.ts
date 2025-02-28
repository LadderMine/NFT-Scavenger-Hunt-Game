/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './answers.entity';
import { Puzzles } from '../puzzles/puzzles.entity';
import { User } from '../users/users.entity';
import { Hints } from '../hints/hints.entity';
import { CheckAnswerDto } from './dto/check-answer.dto';
import { CreateAnswerDto, UpdateAnswerDto } from './answers.dto';
import { validate } from 'class-validator';
import { HintsService } from 'src/hints/hints.service';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,

    @InjectRepository(Puzzles)
    private readonly puzzleRepository: Repository<Puzzles>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Hints)
    private readonly hintRepository: Repository<Hints>,

    private readonly hintsService: HintsService
  ) {}

  async checkAnswer(checkAnswerDto: CheckAnswerDto): Promise<boolean> {
    const errors = await validate(checkAnswerDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const { puzzleId, userId, answer } = checkAnswerDto;

    // Find the puzzle
    const puzzle = await this.puzzleRepository.findOne({
      where: { id: parseInt(puzzleId) },
    });
    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${puzzleId} not found`);
    }

    // Find the user
    const user = await this.userRepository.findOne({
      where: { id: parseInt(userId) },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Store the submitted answer for the puzzle
    const newAnswer = this.answerRepository.create({
      text: answer,
      user,
      puzzle,
    });
    await this.answerRepository.save(newAnswer);

    return this.validateAnswer(puzzle, answer);
  }

  private validateAnswer(puzzle: Puzzles, answer: string): boolean {
    return answer.toLowerCase().trim() === puzzle.correctAnswer.toLowerCase().trim();
  }

  async create(createAnswerDto: CreateAnswerDto): Promise<Answer> {
    try {
      const { userId, puzzleId, text, hintId } = createAnswerDto;

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

      const puzzle = await this.puzzleRepository.findOne({ where: { id: puzzleId } });
      if (!puzzle) throw new NotFoundException(`Puzzle with ID ${puzzleId} not found`);

      let hint: Hints | undefined;
      if (hintId) {
        hint = await this.hintRepository.findOne({ where: { id: hintId } });
        if (!hint) throw new NotFoundException(`Hint with ID ${hintId} not found`);
      }

      const newAnswer = this.answerRepository.create({ text, user, puzzle, hint });
      return await this.answerRepository.save(newAnswer);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(page = 1, limit = 10) {
    try {
      const [answers, total] = await this.answerRepository.findAndCount({
        relations: ['user', 'puzzle', 'hint'],
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        data: answers,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch answers');
    }
  }

  async findOne(id: number): Promise<Answer> {
    try {
      const answer = await this.answerRepository.findOne({
        where: { id },
        relations: ['user', 'puzzle', 'hint'],
      });

      if (!answer) throw new NotFoundException(`Answer with ID ${id} not found`);
      return answer;
    } catch (error) {
      throw new InternalServerErrorException(error.mes);
    }
  };

  async findOneBy(field: string, value: any): Promise<Answer> {
    try {
    const answer = await this.answerRepository.findOne({
      where: { [field]: value },
      relations: ['user', 'puzzle', 'hint'],
    });

    if (!answer) {
      throw new NotFoundException(`Answer with ${field} ${value} not found`);
    }

    return answer;
  } catch (error) {
    
    throw new BadRequestException({
      message: 'Error retriving record',
      details: JSON.stringify({
        message: error.message,
        stack: error.stack,
        details: error.response || error,
      }),
    });
  }
  }
}