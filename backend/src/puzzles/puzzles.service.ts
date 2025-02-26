import { Injectable } from '@nestjs/common';
import { LevelEnum } from 'src/enums/LevelEnum';
import { Repository } from 'typeorm';
import { Puzzles } from './puzzles.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PuzzlesService {

    constructor(
        @InjectRepository(Puzzles)
        private readonly puzzleRepository: Repository<Puzzles>
    ) {}

  static async createPuzzle(level: LevelEnum) {
    const puzzleRepository = Puzzles;
    const newPuzzle = puzzleRepository.create({ level });

    await puzzleRepository.save(newPuzzle);
    return newPuzzle;
  }
}

