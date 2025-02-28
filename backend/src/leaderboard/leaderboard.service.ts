import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { Leaderboard } from './entities/leaderboard.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private leaderboardRepository: Repository<Leaderboard>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Add a user to the leaderboard
   */
  async addUserToLeaderboard(dto: CreateLeaderboardDto): Promise<Leaderboard> {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    // Prevent duplicate leaderboard entry
    const existingEntry = await this.leaderboardRepository.findOne({
      where: { user: { id: dto.userId } },
    });

    if (existingEntry) {
      throw new NotFoundException(`User is already in the leaderboard`);
    }

    // Create new leaderboard entry
    const entry = this.leaderboardRepository.create({
      user,
      username: dto.username,
      profile_picture: dto.profile_picture || '',
      total_points: dto.total_points || 0,
      nfts_collected: dto.nfts_collected || 0,
      challenges_completed: dto.challenges_completed || 0,
      rank: 0, // Will be updated dynamically
    });

    await this.leaderboardRepository.save(entry);
    await this.recalculateRanks();
    return entry;
  }

  /**
   * Update leaderboard entry when a user’s score changes
   */
  async updateLeaderboardEntry(
    userId: number,
    dto: UpdateLeaderboardDto,
  ): Promise<Leaderboard> {
    const entry = await this.getLeaderboardEntry(userId);

    if (dto.username) entry.username = dto.username;
    if (dto.profile_picture) entry.profile_picture = dto.profile_picture;
    if (dto.total_points !== undefined) entry.total_points += dto.total_points;
    if (dto.nfts_collected !== undefined) entry.nfts_collected += dto.nfts_collected;
    if (dto.challenges_completed !== undefined)
      entry.challenges_completed += dto.challenges_completed;

    await this.leaderboardRepository.save(entry);
    await this.recalculateRanks();
    return entry;
  }


  /**
   * Fetch all leaderboard entries sorted by rank
   */
  async getLeaderboard(): Promise<Leaderboard[]> {
    return this.leaderboardRepository.find({
      order: { total_points: 'DESC' },
      relations: ['user'], // Fetch user details
    });
  }

  /**
   * Fetch a specific leaderboard entry by user ID
   */
  async getLeaderboardEntry(userId: number): Promise<Leaderboard> {
    const entry = await this.leaderboardRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!entry) {
      throw new NotFoundException(`Leaderboard entry for user ID ${userId} not found`);
    }

    return entry;
  }


  /**
   * Remove a user from the leaderboard
   */
  async deleteLeaderboardEntry(userId: number): Promise<void> {
    const entry = await this.getLeaderboardEntry(userId);
    await this.leaderboardRepository.remove(entry);
    await this.recalculateRanks();
  }

  /**
   * Recalculate leaderboard ranks dynamically
   */
  private async recalculateRanks(): Promise<void> {
    const entries = await this.leaderboardRepository.find({
      order: { total_points: 'DESC' },
    });

    for (let i = 0; i < entries.length; i++) {
      entries[i].rank = i + 1;
      await this.leaderboardRepository.save(entries[i]);
    }
  }
}
