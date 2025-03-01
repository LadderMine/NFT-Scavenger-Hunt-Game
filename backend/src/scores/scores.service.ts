import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scores } from './scores.entity';
import { User } from 'src/users/users.entity';
import { PuzzlesService } from 'src/puzzles/puzzles.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UsersService } from 'src/users/users.service';
import { UserProgressService } from 'src/user-progress/user-progress.service';
import { UpdateScoreDto } from './dto/update-score.dto';
import { LeaderboardGateway } from 'src/leaderboard/leaderboard.gateway';
import { Puzzles } from 'src/puzzles/puzzles.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Scores)
    private scoresRepository: Repository<Scores>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
    //deine dependecy injection for user service
    private readonly userService : UsersService,


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

  public async findOneById(id: number): Promise<Scores> {
    const scores = await this.scoresRepository.findOne({ where: { id } });

    if (!scores) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return ( scores);
  }
  
  /**
   * A function to retrieve scores from DB
   * @returns an array with all Scores
   */
  async getAllScores(){
    return await this.scoresRepository.find();
  }

  async createScore(dto: CreateScoreDto){
    const user = await this.userService.FindByUsername(dto.username);
    if (!user) throw new Error("User not found");
    
    const puzzle = await this.puzzleService.getAPuzzle(dto.puzzleId);
    if (!puzzle) throw new Error("Puzzle not found");
    

    // TODO: Fix the relation between userProgress and scores so that the create method is properly formated
    const score = this.scoresRepository.create({
        user,
        score: dto.score,
        puzzle,
    });
    return await this.scoresRepository.save(score);
  }

  async deleteScore(id: number): Promise<void> {
    await this.scoresRepository.delete(id);
  }

}
