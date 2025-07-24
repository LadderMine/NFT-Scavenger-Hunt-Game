import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForkedPuzzle } from './entities/forked-puzzle.entity';

import { PuzzleVersion } from '../puzzle-versioning/entities/puzzle-version.entity';
import { CreateForkDto } from './dto/create-fork.dto';

@Injectable()
export class PuzzleForkService {
  constructor(
    @InjectRepository(ForkedPuzzle)
    private readonly forkedPuzzleRepository: Repository<ForkedPuzzle>,
    
    @InjectRepository(PuzzleVersion)
    private readonly puzzleVersionRepository: Repository<PuzzleVersion>,
  ) {}

  async fork(dto: CreateForkDto): Promise<ForkedPuzzle> {
    const { originalPuzzleId, version, newTitle } = dto;

    
    const puzzleToFork = await this.findSourcePuzzle(originalPuzzleId, version);

    if (!puzzleToFork) {
      throw new NotFoundException(
        `Puzzle with ID "${originalPuzzleId}" and version "${version || 'latest'}" not found.`,
      );
    }
    
    const newFork = this.forkedPuzzleRepository.create({
      originalPuzzleId: puzzleToFork.puzzleId,
      forkedFromVersion: puzzleToFork.version,
      title: newTitle || `Fork of: ${puzzleToFork.title}`, 
      content: puzzleToFork.content,
    });

    return this.forkedPuzzleRepository.save(newFork);
  }


  private async findSourcePuzzle(
    puzzleId: string,
    version?: number,
  ): Promise<PuzzleVersion> {
    if (version) {
      return this.puzzleVersionRepository.findOneBy({ puzzleId, version });
    }
    
    return this.puzzleVersionRepository.findOne({
      where: { puzzleId },
      order: { version: 'DESC' },
    });
  }
}