import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';

import { LeaderboardService } from './leaderboard.service';
import { Leaderboard } from './entities/leaderboard.entity';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Post()
  async addUserToLeaderboard(@Body() createLeaderboardDto: CreateLeaderboardDto): Promise<Leaderboard> {
    return this.leaderboardService.addUserToLeaderboard(createLeaderboardDto);
  }

  @Get()
  async getLeaderboard(): Promise<Leaderboard[]> {
    return this.leaderboardService.getLeaderboard();
  }

  @Get(':id')
  async getLeaderboardEntry(@Param('id', ParseIntPipe) id: number): Promise<Leaderboard> {
    return this.leaderboardService.getLeaderboardEntry(id);
  }

  @Patch(':id')
  async updateLeaderboardEntry(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeaderboardDto: UpdateLeaderboardDto,
  ): Promise<Leaderboard> {
    return this.leaderboardService.updateLeaderboardEntry(id, updateLeaderboardDto);
  }

  @Delete(':id')
  async deleteLeaderboardEntry(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.leaderboardService.deleteLeaderboardEntry(id);
  }
}
