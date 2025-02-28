import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { LeaderboardService } from './providers/leaderboard.service';
import { Leaderboard } from './entities/leaderboard.entity';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async addUserToLeaderboard(
    @Body() createLeaderboardDto: CreateLeaderboardDto,
  ): Promise<Leaderboard> {
    return this.leaderboardService.addUserToLeaderboard(createLeaderboardDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  findAll() {
    return this.leaderboardService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getLeaderboardEntry(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Leaderboard> {
    return this.leaderboardService.getLeaderboardEntry(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeaderboardDto: UpdateLeaderboardDto,
  ) {
    return this.leaderboardService.update(id, updateLeaderboardDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async deleteLeaderboardEntry(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.leaderboardService.deleteLeaderboardEntry(id);
  }

  @Get('me/:username')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getUserLeaderboardStats(
    @Param('username') username: string,
  ): Promise<Leaderboard> {
    return this.leaderboardService.getUserLeaderboardStats(username);
  }

  @Get('rank/:username')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getUserRank(
    @Param('username') username: string,
  ): Promise<{ rank: number }> {
    return this.leaderboardService.getUserRank(username);
  }

  @Get('stats')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getLeaderboardStats(): Promise<{ totalPlayers: number; totalPoints: number }> {
    return this.leaderboardService.getLeaderboardStats();
  }
}
