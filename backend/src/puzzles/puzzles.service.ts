import { Injectable, BadRequestException } from '@nestjs/common';
import { LevelEnum } from 'src/enums/LevelEnum';
@Injectable()
export class PuzzlesService {
  private puzzles: { id: number; level: LevelEnum }[] = [];

  createPuzzle(id: number, level: LevelEnum) {
    if (!Object.values(LevelEnum).includes(level)) {
      throw new BadRequestException(`Invalid level: ${level}`);
    }
    const newPuzzle = {
      id: this.puzzles.length + 1,
      level: level,
    };
    this.puzzles.push(newPuzzle);
    return newPuzzle;
  }
  getAllPuzzles() {
    return this.puzzles;
  }
}
