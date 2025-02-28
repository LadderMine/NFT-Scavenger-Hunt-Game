import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leaderboard } from '../entities/leaderboard.entity';
import { CreateLeaderboardDto } from '../dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from '../dto/update-leaderboard.dto';
import { UpdateLeaderboardRanks } from 'src/rank/providers/updateLeaderBoardRanks.service';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private readonly leaderboardRepository: Repository<Leaderboard>,
    private readonly updateLeaderboardRanks: UpdateLeaderboardRanks, // Inject rank service
  ) {}

  async addUserToLeaderboard(
    createLeaderboardDto: CreateLeaderboardDto,
  ): Promise<Leaderboard> {
    const leaderboard = this.leaderboardRepository.create(createLeaderboardDto);
    return await this.leaderboardRepository.save(leaderboard);
  }

  async getLeaderboard(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'rank',
  ): Promise<{
    data: Leaderboard[];
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  }> {
    const offset = (page - 1) * limit;

    // Validate sorting field
    const allowedSortFields = ['rank', 'total_points', 'challenges_completed'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'rank';

    // Fetch leaderboard with sorting and pagination
    const [data, total] = await this.leaderboardRepository.findAndCount({
      order: { [orderField]: 'ASC' },
      take: limit,
      skip: offset,
    });

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      perPage: limit,
    };
  }

  async getLeaderboardEntry(id: number): Promise<Leaderboard> {
    return this.leaderboardRepository.findOne({ where: { id } });
  }

  async updateLeaderboardEntry(
    id: number,
    updateLeaderboardDto: UpdateLeaderboardDto,
  ): Promise<Leaderboard> {
    const leaderboard = await this.getLeaderboardEntry(id);
    if (!leaderboard) {
      throw new Error('Leaderboard entry not found');
    }
    Object.assign(leaderboard, updateLeaderboardDto);
    return this.leaderboardRepository.save(leaderboard);
  }

  async deleteLeaderboardEntry(id: number): Promise<void> {
    const leaderboardEntry = await this.getLeaderboardEntry(id);
    if (!leaderboardEntry) {
      throw new Error('Leaderboard entry not found');
    }
    await this.leaderboardRepository.remove(leaderboardEntry);
  }

  async updatePlayerScore(userId: number, newScore: number) {
    // Update player's score in leaderboard
    await this.leaderboardRepository.update(
      { user: { id: userId } },
      { total_points: newScore },
    );

    // Call rank recalculation
    await this.updateLeaderboardRanks.updateLeaderboardRanks();
  }

  async getUserLeaderboardStats(username: string) {
    const leaderboardEntry = await this.leaderboardRepository.findOne({
      where: { username },
      select: ['rank', 'total_points', 'nfts_collected', 'challenges_completed'],
    });

    if (!leaderboardEntry) {
      throw new Error('Leaderboard entry not found for user');
    }

    return leaderboardEntry;
  }

  async getUserRank(username: string): Promise<{ rank: number }> {
    const leaderboard = await this.leaderboardRepository.find({
      order: { total_points: 'DESC' },
    });
    const rank = leaderboard.findIndex((entry) => entry.user.username === username) + 1;
    if (rank === 0) {
      throw new Error('User not found in leaderboard');
    }
    return { rank };
  }

  async getLeaderboardStats(): Promise<{ totalPlayers: number; totalPoints: number }> {
    const leaderboardEntries = await this.leaderboardRepository.find();
    const totalPlayers = leaderboardEntries.length;
    const totalPoints = leaderboardEntries.reduce((acc, entry) => acc + entry.total_points, 0);
    return { totalPlayers, totalPoints };
  }
}
