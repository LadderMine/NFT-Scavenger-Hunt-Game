import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProgress } from "./user-progress.entity";
import { Puzzles } from "src/puzzles/puzzles.entity";
import { Level } from "src/level/entities/level.entity";

@Injectable()
export class LevelProgressService {
  constructor(
    @InjectRepository(UserProgress)
    private userProgressRepository: Repository<UserProgress>,
    @InjectRepository(Puzzles)
    private puzzlesRepository: Repository<Puzzles>,
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
  ) {}

  async calculateLevelCompletion(userId: number, levelId: string): Promise<{ progress: number; solved: number; total: number }> {
    // Fetch total number of puzzles for the given level
    const totalPuzzles = await this.puzzlesRepository.count({
      where: { level: { id: levelId } },
    });

    // Fetch the number of puzzles solved by the user in the given level
    const solvedPuzzles = await this.userProgressRepository.count({
      where: {
        user: { id: userId },
        puzzle: { level: { id: levelId } },
        completed: true,
      },
    });

    // Calculate the progress percentage
    const progress = totalPuzzles > 0 ? (solvedPuzzles / totalPuzzles) * 100 : 0;

    return {
      progress: parseFloat(progress.toFixed(2)),
      solved: solvedPuzzles,
      total: totalPuzzles,
    };
  }

  async getPuzzlesSolvedPerLevel(userId: number, levelId: string): Promise<{ puzzles: Puzzles[], count: number }> {
  // First, verify the level exists
  const level = await this.levelRepository.findOne({
    where: { id: levelId },
  });

  if (!level) {
    throw new Error(`Level with ID ${levelId} not found`);
  }

  // Find all user progress entries that match our criteria
  const userProgressEntries = await this.userProgressRepository.find({
    where: { 
      user: { id: userId }, 
      puzzle: { level: { id: levelId } }, 
      completed: true 
    },
    relations: ['puzzle', 'puzzle.level', 'puzzle.hints', 'puzzle.answers'],
  });

  // Extract the puzzle entities from the progress entries
  const solvedPuzzles = userProgressEntries.map(progress => progress.puzzle);

  return {
    puzzles: solvedPuzzles,
    count: solvedPuzzles.length
  };
}
}