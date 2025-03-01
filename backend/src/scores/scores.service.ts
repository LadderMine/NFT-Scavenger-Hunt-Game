import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { Scores } from './scores.entity';
import { PuzzlesService } from 'src/puzzles/puzzles.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UsersService } from 'src/users/users.service';
import { UserProgressService } from 'src/user-progress/user-progress.service';
import { UpdateScoreDto } from './dto/update-score.dto';

@Injectable()
export class ScoresService {
  constructor(

    //define repository injection for scores entity
    @InjectRepository(Scores)
    private  scoresRepository: Repository<Scores>,

    //deine dependecy injection for user service
    private readonly userService : UsersService,


    //define dependency injection for puzzle Service
    private readonly puzzleService: PuzzlesService,

    //define dependency injection for user progress Service
    private readonly userProgressService: UserProgressService
  ) {}

  /**
   * A function to retrieve scores from DB
   * @returns an array with all Scores
   */
  async getAllScores(){
    return await this.scoresRepository.find();
  }

  async getById(id:number){
    return await this.scoresRepository.findOne({where: {id}});
  }

  async createScore(dto: CreateScoreDto){
    const user = await this.userService.FindByUsername(dto.username);
    if (!user) throw new Error("User not found");
    
    const puzzle = await this.puzzleService.getAPuzzle(dto.puzzleId);
    if (!puzzle) throw new Error("Puzzle not found");
    
    const userProgress = await this.userProgressService.getUserProgress(user.id); //returns an array, scores expect one item
    if (!userProgress) throw new Error("User progress not found");

    // TODO: Fix the relation between userProgress and scores so that the create method is properly formated
    const score = this.scoresRepository.create({
        user,
        score: dto.score,
        puzzle,
        userProgress
    });
    return await this.scoresRepository.save(score);
  }

  async updateScore(id: number, dto: UpdateScoreDto): Promise<Scores | null> {
    const score = await this.scoresRepository.findOne({ where: { id } });
    if (!score) throw new Error("Score not found");

    score.score = dto.score;
    return await this.scoresRepository.save(score);
  }

  async deleteScore(id: number): Promise<void> {
    await this.scoresRepository.delete(id);
  }

  //fetch leaderboard with pagination
  //TODO -> Fix the function to use userService, it provides more order
  // async getLeaderboard(page: number = 1, limit: number = 10) {
  //   const [users, total] = await this.userRepository.findAndCount({
  //     order: { scores: 'DESC', update_at: 'ASC' },
  //     skip: (page - 1) * limit,
  //     take: limit,
  //   });

  //   return {
  //     data: users,
  //     currentPage: page,
  //     totalPages: Math.ceil(total / limit),
  //     totalItems: total,
  //   };
  // }

}
