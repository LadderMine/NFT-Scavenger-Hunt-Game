import { Injectable, NotFoundException } from '@nestjs/common';
import { LevelEnum } from 'src/enums/LevelEnum';
import { Repository } from 'typeorm';
import { Puzzles } from './puzzles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePuzzleDto } from './dtos/update-puzzle.dto';

@Injectable()
export class PuzzlesService {
  constructor(
    @InjectRepository(Puzzles)
    private readonly puzzleRepository: Repository<Puzzles>
  ) {}

  public async createPuzzle(level: LevelEnum) {
    const newPuzzle = this.puzzleRepository.create({ level });
    await this.puzzleRepository.save(newPuzzle);
    return newPuzzle;
  }

  public async updatePuzzle(id: number, updatePuzzleDto: UpdatePuzzleDto): Promise<Puzzles> {
    const puzzle = await this.puzzleRepository.findOne({ where: { id } });
    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${id} not found`);
    }
    // Merge updates into the existing puzzle
    Object.assign(puzzle, updatePuzzleDto);
    return this.puzzleRepository.save(puzzle);
  }

  public async getAPuzzle(id: string): Promise<Puzzles | null> {
    const puzzle = await this.puzzleRepository.findOne({ where: { id: parseInt(id) } });
    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${id} not found`);
    }
    return puzzle;
  }
}
