import { Injectable } from '@nestjs/common';
import { CreateLeaderboardDto } from '../dto/create-leaderboard.dto';
import { UpdateAuthDto } from 'src/auth/dto/update-auth.dto';
import { UpdateLeaderboardDto } from '../dto/update-leaderboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leaderboard } from '../entities/leaderboard.entity';
import { Scores } from 'src/scores/scores.entity';
import { ScoresService } from 'src/scores/scores.service';

@Injectable()
export class LeaderboardService {

  constructor(
    // Repository injection for leaderboard entity
    @InjectRepository(Leaderboard)
    private leaderBoardRepository: Repository<Leaderboard>,

    //dependenc innnjection for scores service
    private readonly scoresService: ScoresService
  ){}
  create(createLeaderboardDto: CreateLeaderboardDto) {
    return 'This action adds a new leaderboard';
  }

  findAll() {
    return `This action returns all leaderboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} leaderboard`;
  }

  update(id: number, updateLeaderboardDto: UpdateLeaderboardDto) {
    return `This action updates a #${id} leaderboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} leaderboard`;
  }
}
