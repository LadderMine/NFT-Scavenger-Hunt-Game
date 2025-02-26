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

  public async createPuzzle(level: LevelEnum) {
    // const newPuzzle = await puzzleRepository.create({ level });
    const newPuzzle = this.puzzleRepository.create({ level });


    await this.puzzleRepository.save(newPuzzle);
        return newPuzzle;
  }
}
