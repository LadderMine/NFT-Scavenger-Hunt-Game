import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnswerDto, UpdateAnswerDto } from './answers.dto';
import { Answer } from './answers.entity';
import { User } from '../users/users.entity';
import { Puzzles } from '../puzzles/puzzles.entity';
import { Hints } from '../hints/hints.entity';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Puzzles)
    private puzzleRepository: Repository<Puzzles>,

    @InjectRepository(Hints)
    private hintRepository: Repository<Hints>,
  ) {}

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
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateAnswerDto: UpdateAnswerDto): Promise<Answer> {
    try {
      const answer = await this.findOne(id);
      Object.assign(answer, updateAnswerDto);

      if (updateAnswerDto.userId) {
        answer.user = await this.userRepository.findOne({ where: { id: updateAnswerDto.userId } });
      }

      if (updateAnswerDto.puzzleId) {
        answer.puzzle = await this.puzzleRepository.findOne({ where: { id: updateAnswerDto.puzzleId } });
      }

      if (updateAnswerDto.hintId) {
        answer.hint = await this.hintRepository.findOne({ where: { id: updateAnswerDto.hintId } });
      }

      return await this.answerRepository.save(answer);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.answerRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Answer with ID ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
