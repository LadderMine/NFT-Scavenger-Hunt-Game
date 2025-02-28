import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Puzzles } from './puzzles.entity';
import { Repository } from 'typeorm';
import { LevelService } from 'src/level/level.service';
import { NftsService } from 'src/nfts/nfts.service';
import { ScoresService } from 'src/scores/scores.service';

@Injectable()
export class PuzzlesService {
  constructor(
    @InjectRepository(Puzzles)
    private readonly puzzleRepository: Repository<Puzzles>,

    // Dependency injection for LevelService
    private readonly levelService: LevelService,

    // Dependency injection for NFTs service
    private readonly nftService: NftsService,

    // Dependency injection for ScoresService
    private readonly scoresService: ScoresService,
  ) {}

  // Fetch a puzzle by ID
  public async getAPuzzle(id: number): Promise<Puzzles> {
    const puzzle = await this.puzzleRepository.findOne({ where: { id } });
    if (!puzzle) {
      throw new NotFoundException(`Puzzle not found`);
    }
    return puzzle;
  }

  // Update a puzzle by ID
  public async updatePuzzle(
    id: number,
    updatePuzzleDto: Partial<Puzzles>,
  ): Promise<Puzzles> {
    const puzzle = await this.puzzleRepository.findOne({ where: { id } });
    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${id} not found`);
    }

    // Merge updates into the existing puzzle
    Object.assign(puzzle, updatePuzzleDto);
    return this.puzzleRepository.save(puzzle);
  }



  public async createPuzzle(puzzleData: Partial<Puzzles>): Promise<Puzzles> {
    // Create a new puzzle instance
    const puzzle = this.puzzleRepository.create(puzzleData);
  
    // Save the puzzle to the database
    await this.puzzleRepository.save(puzzle);
  
    // Increment level count if levelEnum is provided
    if (puzzle.levelEnum) {
      await this.levelService.incrementCount(puzzle.levelEnum);
    }
  
    return puzzle;
  }
}

