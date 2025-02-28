import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { Scores } from './scores.entity';
import { PuzzlesService } from 'src/puzzles/puzzles.service';
import { ScoreResponseDto } from './dto/response-score.dto';

@Injectable()
export class ScoresService {
  constructor(

    //define repository injection for scores entity
    @InjectRepository(Scores)
    private  scoresRepository: Repository<Scores>,

    //deine repository injection for user entity
    @InjectRepository(User)
    private  userRepository: Repository<User>,

    //define dependency injection for puzzle Service
    private readonly puzzleService: PuzzlesService,
  ) {}

  /**
   * A function to retrieve scores from DB
   * @returns an array with all Scores
   */
  async getAllScores() : Promise<ScoreResponseDto[]> {
    const scores: Scores[] = await this.scoresRepository.find();
    const scoresDto: ScoreResponseDto[] = scores.map(item => {
      return ScoreResponseDto.map(item);
    });
    return scoresDto;
  }

  async getById(id:number): Promise<ScoreResponseDto>{
    return ScoreResponseDto.map(await this.scoresRepository.findOne({where: {id}}));
  }

  async createScore(score: ScoreCreationDTO) {

  }



  //fetch leaderboard with pagination
  async getLeaderboard(page: number = 1, limit: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      order: { scores: 'DESC', update_at: 'ASC' },
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

  // Update or insert user score
  async updateScore(username: string, score: number) {
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      user.score = score;
      // update score if user exists
    } else {
      user = this.userRepository.create({ username, score });
      //create a new user if not found
    }
    return this.userRepository.save(user);
  }
}
