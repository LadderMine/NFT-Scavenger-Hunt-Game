import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scores } from './scores.entity';
import { User } from 'src/users/users.entity';
import { PuzzlesService } from 'src/puzzles/puzzles.service';
import { LeaderboardGateway } from 'src/leaderboard/leaderboard.gateway';
import { Puzzles } from 'src/puzzles/puzzles.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Scores)
    private scoresRepository: Repository<Scores>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly puzzleService: PuzzlesService,
    private readonly leaderboardGateway: LeaderboardGateway,
  ) {}

  // Fetch leaderboard with pagination
  async getLeaderboard(page: number = 1, limit: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      order: { scores: 'DESC', updatedAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };
  }

  async updateScore(username: string, puzzleId: number, score: number) {
   
    const puzzle = await this.puzzleService.getAPuzzle(puzzleId);
    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${puzzleId} not found.`);
    }

    let user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
     
      user = this.userRepository.create({ username });
      await this.userRepository.save(user);
    }


    let existingScore = await this.scoresRepository.findOne({
      where: { user, puzzle },
    });

    if (existingScore) {
      existingScore.score = score;
      existingScore = this.scoresRepository.create({ user, puzzle, score });
    }

    await this.scoresRepository.save(existingScore);

 
    const leaderboard = await this.getLeaderboard(1, 10);
    this.leaderboardGateway.sendLeaderboardUpdate(leaderboard);

    return existingScore;
  }

 
  async handlePuzzleDeletion(puzzleId: number) {
    const puzzle = await this.puzzleService.getAPuzzle(puzzleId);
    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${puzzleId} not found.`);
    }

   
    await this.scoresRepository
      .createQueryBuilder()
      .update(Scores)
      .set({ puzzle: null }) 
      .where("puzzleId = :puzzleId", { puzzleId })
      .execute();

    return { message: `Puzzle ID ${puzzleId} scores updated.` };
  }
}
