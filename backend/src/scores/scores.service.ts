import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { Scores } from './scores.entity';
import { PuzzlesService } from 'src/puzzles/puzzles.service';
import { LeaderboardGateway } from 'src/leaderboard/leaderboard.gateway';

@Injectable()
export class ScoresService {
  constructor(
    //deine repository injection for scores entity
    @InjectRepository(Scores)
    private scoresRepository: Repository<Scores>,

    //deine repository injection for user entity
    @InjectRepository(User)
    private userRepository: Repository<User>,

    //define dependency injection for puzzle Service
    private readonly puzzleService: PuzzlesService,

    //define dependency injection for leaderboard Service
    private readonly leaderboardGateway: LeaderboardGateway,
  ) {}
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
  async updateScore(username: string, newScore: number) {
  let user = await this.userRepository.findOne({ where: { username } });
  
  if (user) {
    // Only update if the new score is greater than the current score
    if (newScore > user.score) {
      user.score = newScore;
    } else {
      // Option 1: Throw an error to indicate validation failure
      throw new Error("New score must be higher than the current score.");
      
      // Option 2: Alternatively, you could simply return or handle this case gracefully
      // return user; // No update, return existing user
    }
  } else {
    // Create a new user with the new score if the user doesn't exist
    user = this.userRepository.create({ username, score: newScore });
  }

  // Save the updated or new user
  const savedUser = await this.userRepository.save(user);

  // Broadcast the updated leaderboard via WebSockets
  const leaderboard = await this.getLeaderboard(1, 10);
  this.leaderboardGateway.sendLeaderboardUpdate(leaderboard);

  return savedUser;
}

}
