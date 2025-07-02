import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRank } from './entities/user-ranking.entity';
import { UserRankDto } from './dto/create-user-ranking.dto';

@Injectable()
export class UserRankingService {
  constructor(
    @InjectRepository(UserRank)
    private readonly userRankRepository: Repository<UserRank>,
  ) {}

  async calculateAndUpdateRank(userId: string): Promise<UserRank> {
    // In a real app, you would fetch actual user metrics here
    const mockAchievements = Math.floor(Math.random() * 10);
    const mockActivityPoints = Math.floor(Math.random() * 1000);
    
    // Calculate score (adjust weights as needed)
    const score = (mockAchievements * 100) + mockActivityPoints;

    let userRank = await this.userRankRepository.findOne({ where: { userId } });

    if (!userRank) {
      userRank = this.userRankRepository.create({ userId });
    }

    userRank.score = score;
    userRank.achievements = mockAchievements;
    userRank.activityPoints = mockActivityPoints;
    userRank.lastUpdated = new Date();

    // Save first to get the score updated
    await this.userRankRepository.save(userRank);

    // Calculate rank based on score (lower rank number means better)
    const allRanks = await this.userRankRepository
      .createQueryBuilder('rank')
      .orderBy('rank.score', 'DESC')
      .getMany();

    allRanks.forEach((rank, index) => {
      rank.rank = index + 1;
    });

    await this.userRankRepository.save(allRanks);

    return this.userRankRepository.findOne({ where: { userId } });
  }

  async getUserRank(userId: string): Promise<UserRankDto> {
    let userRank = await this.userRankRepository.findOne({ where: { userId } });

    if (!userRank) {
      userRank = await this.calculateAndUpdateRank(userId);
    }

    return {
      userId: userRank.userId,
      score: userRank.score,
      achievements: userRank.achievements,
      activityPoints: userRank.activityPoints,
      rank: userRank.rank,
    };
  }
}
