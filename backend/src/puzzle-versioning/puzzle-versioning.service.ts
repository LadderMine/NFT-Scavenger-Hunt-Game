import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PuzzleVersion } from './entities/puzzle-version.entity';
import { CreatePuzzleVersionDto } from './dto/create-puzzle-version.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PuzzleVersioningService {
  constructor(
    @InjectRepository(PuzzleVersion)
    private readonly puzzleVersionRepository: Repository<PuzzleVersion>,
  ) {}

  async createNewVersion(dto: CreatePuzzleVersionDto): Promise<PuzzleVersion> {
    let version = 1;
    const puzzleId = dto.puzzleId || uuidv4(); 

    if (dto.puzzleId) {
      const latestVersion = await this.findLatestVersion(dto.puzzleId);
      if (latestVersion) {
        version = latestVersion.version + 1;
      }
    }

    const newPuzzleVersion = this.puzzleVersionRepository.create({
      ...dto,
      puzzleId,
      version,
    });

    return this.puzzleVersionRepository.save(newPuzzleVersion);
  }

  async findLatestVersion(puzzleId: string): Promise<PuzzleVersion> {
    const latest = await this.puzzleVersionRepository.findOne({
      where: { puzzleId },
      order: { version: 'DESC' },
    });

    if (!latest) {
      throw new NotFoundException(`No puzzle found with ID "${puzzleId}"`);
    }
    return latest;
  }

  async findAllVersions(puzzleId: string): Promise<PuzzleVersion[]> {
    const versions = await this.puzzleVersionRepository.find({
      where: { puzzleId },
      order: { version: 'DESC' }, 
    });

    if (!versions || versions.length === 0) {
        throw new NotFoundException(`No puzzle found with ID "${puzzleId}"`);
    }
    return versions;
  }
}