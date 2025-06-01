import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Puzzles } from './puzzles.entity';
import { Repository } from 'typeorm';
import { LevelService } from 'src/level/level.service';
import { NftsService } from 'src/nfts/nfts.service';
import { ScoresService } from 'src/scores/scores.service';
import { CreatePuzzleDto } from './dtos/createPuzzles.dto';
import { UpdatePuzzleDto } from './dtos/update-puzzle.dto';

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

  /**
   * Instead of mutating the existing record, create a new version of the puzzle.
   */
  public async updatePuzzle(
    id: number,
    updatePuzzleDto: UpdatePuzzleDto,
  ): Promise<Puzzles> {
    const currentPuzzle = await this.puzzleRepository.findOne({ where: { id } });

    if (!currentPuzzle) {
      throw new NotFoundException(`Puzzle with ID ${id} not found`);
    }

    // Mark the current latest puzzle as no longer latest
    currentPuzzle.isLatest = false;
    await this.puzzleRepository.save(currentPuzzle);

    // Determine the original puzzle ID (root of the version chain)
    const originalPuzzleId = currentPuzzle.originalPuzzleId || currentPuzzle.id;

    // Build the new puzzle version
    const newPuzzleData: Partial<Puzzles> = {
      ...currentPuzzle, // copy existing fields
      ...updatePuzzleDto, // override with updates
      id: undefined, // ensure new primary key is generated
      version: currentPuzzle.version + 1,
      originalPuzzleId,
      isLatest: true,
      levelEnum: (updatePuzzleDto as any).difficulty ?? currentPuzzle.levelEnum,
    };

    const newPuzzle = this.puzzleRepository.create(newPuzzleData);
    return this.puzzleRepository.save(newPuzzle);
  }

  public async createPuzzle(createPuzzleDto: CreatePuzzleDto): Promise<Puzzles> {
    // Map DTO to entity structure
    const puzzle = this.puzzleRepository.create({
      pointValue: createPuzzleDto.pointValue,
      levelEnum: createPuzzleDto.level,
      version: 1,
      isLatest: true,
    });

    const savedPuzzle = await this.puzzleRepository.save(puzzle);

    // Increment level count
    await this.levelService.incrementCount(savedPuzzle.levelEnum);

    return savedPuzzle;
  }

  async deletePuzzle(id: string): Promise<void> {
    const puzzle = await this.puzzleRepository.findOne({ where: { id: Number(id) } });

    if (!puzzle) {
      throw new NotFoundException('Puzzle not found.');
    }

    await this.puzzleRepository.softRemove(puzzle); // Soft delete retains history

    // Decrement level count
    if (puzzle.levelEnum) {
      await this.levelService.decrementCount(puzzle.levelEnum);
    }
  }
}

