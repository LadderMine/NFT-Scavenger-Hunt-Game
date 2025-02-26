import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Leaderboard } from 'src/leaderboard/entities/leaderboard.entity';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CalculateRanks {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async calculateRanks() {
    // Fetch all users sorted by total_points (descending order)
    const users = await this.userRepository.find({
      order: { scores: 'DESC' },
    });

    let rank = 1;
    let previousScore = null;
    let skipRank = 0;

    const rankedPlayers = users.map((user, index) => {
      if (user.scores === previousScore) {
        skipRank++; // Keep the same rank for tied scores
      } else {
        rank += skipRank;
        skipRank = 1;
      }
      previousScore = user.scores;

      return { userId: user.id, rank };
    });

    return rankedPlayers;
  }
}
