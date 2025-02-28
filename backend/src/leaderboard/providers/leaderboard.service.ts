import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leaderboard } from '../entities/leaderboard.entity';
import { CreateLeaderboardDto } from '../dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from '../dto/update-leaderboard.dto';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private readonly leaderboardRepository: Repository<Leaderboard>,
  ) {}

  async addUserToLeaderboard(
    createLeaderboardDto: CreateLeaderboardDto,
  ): Promise<Leaderboard> {
    const leaderboard = this.leaderboardRepository.create(createLeaderboardDto);
    return await this.leaderboardRepository.save(leaderboard);
  }

  async getLeaderboard(): Promise<Leaderboard[]> {
    return this.leaderboardRepository.find();
  }

  async getLeaderboardEntry(id: number): Promise<Leaderboard> {
    return this.leaderboardRepository.findOne({
      where: { id },
    });
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
