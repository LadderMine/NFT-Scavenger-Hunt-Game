import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Puzzle } from './puzzle.entity';
import { CreatePuzzleDto } from './dto/create-puzzle.dto';
import { UpdatePuzzleDto } from './dto/update-puzzle.dto';

@Injectable()
export class PuzzleService {
  constructor(
    @InjectRepository(Puzzle)
    private readonly puzzleRepository: Repository<Puzzle>,
  ) {}

  async create(createPuzzleDto: CreatePuzzleDto): Promise<Puzzle> {
    const puzzle = this.puzzleRepository.create(createPuzzleDto);
    return this.puzzleRepository.save(puzzle);
  }

  async findAllAdmin(): Promise<Puzzle[]> {
    return this.puzzleRepository.find();
  }

  async findOneAdmin(id: string): Promise<Puzzle> {
    const puzzle = await this.puzzleRepository.findOne({ where: { id } });
    if (!puzzle) throw new NotFoundException('Puzzle not found');
    return puzzle;
  }

  async update(id: string, updatePuzzleDto: UpdatePuzzleDto): Promise<Puzzle> {
    const puzzle = await this.findOneAdmin(id);
    Object.assign(puzzle, updatePuzzleDto);
    return this.puzzleRepository.save(puzzle);
  }

  async remove(id: string): Promise<void> {
    const puzzle = await this.findOneAdmin(id);
    await this.puzzleRepository.remove(puzzle);
  }

  async findActive(difficulty?: string): Promise<Partial<Puzzle>[]> {
    const where: any = { isActive: true };
    if (difficulty) where.difficulty = difficulty;
    const puzzles = await this.puzzleRepository.find({ where });
    // Exclude solution and hint
    return puzzles.map(({ id, title, description, difficulty, rewardId, createdAt, updatedAt }) => ({
      id, title, description, difficulty, rewardId, createdAt, updatedAt
    }));
  }
}
