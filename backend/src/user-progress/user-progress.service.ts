import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Hints } from "../hints/hints.entity";
import { UserProgress } from "./userprogress.entity";
import { UserProgressDto } from "./dto/user-progress.dto";


@Injectable()
export class UserProgressService {
  constructor(
    @InjectRepository(UserProgress)
    private userProgressRepository: Repository<UserProgress>,
  ) {}

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return this.userProgressRepository.find({
      where: { user: { id: userId } },
      relations: ["puzzles", "hints"],
    });
  }

  async updateProgress(userProgressDto: UserProgressDto): Promise<UserProgress> {
    const { userId, puzzleId, completed, hintsId } = userProgressDto;
    let progress = await this.userProgressRepository.findOne({
      where: { user: { id: userId }, puzzles: { id: puzzleId } },
    });

    if (!progress) {
      progress = this.userProgressRepository.create({
        user: { id: userId },
        puzzles: { id: puzzleId },
      });
    }

    if (hintsId) {
      progress.hints = { id: hintsId } as Hints;
      progress.hintsUsed += 1;
    }

    progress.completed = completed;
    progress.lastUpdated = new Date();

    return this.userProgressRepository.save(progress);
  }

  async getUserScore(userId: number): Promise<number> {
    const progress = await this.userProgressRepository.find({
      where: { user: { id: userId }, completed: true },
      relations: ["puzzles"],
    });

    return progress.reduce((total, p) => total + p.puzzles.pointValue, 0);
  }
}
