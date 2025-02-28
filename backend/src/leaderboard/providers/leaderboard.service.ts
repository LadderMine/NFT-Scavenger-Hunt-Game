import { Injectable } from '@nestjs/common';
import { CreateLeaderboardDto } from '../dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from '../dto/update-leaderboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Leaderboard } from '../entities/leaderboard.entity';
import { Repository } from 'typeorm';
import { UpdateLeaderboardRanks } from 'src/rank/providers/updateLeaderBoardRanks.service';

@Injectable()
export class LeaderboardService {
    constructor(
    @InjectRepository(Leaderboard)
    private leaderboardRepository: Repository<Leaderboard>,
    private readonly updateLeaderboardRanks: UpdateLeaderboardRanks, // Inject rank service
    
  ) {}
  create(createLeaderboardDto: CreateLeaderboardDto) {
    return 'This action adds a new leaderboard';
  }

  async findAll(
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
      order: { [orderField]: 'ASC' }, // Sorting dynamically
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

  findOne(id: number) {
    return `This action returns a #${id} leaderboard`;
  }

   public async updatePlayerScore(userId: number, newScore: number) {
    // Update player's score in leaderboard
    await this.leaderboardRepository.update(
      { user: { id: userId } },
      { total_points: newScore },
    );

    // Call rank recalculation
    await this.updateLeaderboardRanks.updateLeaderboardRanks();
  }
  remove(id: number) {
    return `This action removes a #${id} leaderboard`;
  }
}