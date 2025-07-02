import { Controller, Get, Query, Param } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import type { LeaderboardService } from "../services/leaderboard.service"
import type { LeaderboardQueryDto } from "../dto/leaderboard-query.dto"
import { LeaderboardResponseDto } from "../dto/leaderboard-response.dto"

@ApiTags("Leaderboard")
@Controller("leaderboard")
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('global')
  @ApiOperation({ summary: 'Get global leaderboard' })
  @ApiResponse({ status: 200, description: 'Global leaderboard retrieved successfully', type: LeaderboardResponseDto })
  async getGlobalLeaderboard(@Query() query: LeaderboardQueryDto): Promise<LeaderboardResponseDto> {
    return this.leaderboardService.getGlobalLeaderboard(query);
  }

  @Get("country/:country")
  @ApiOperation({ summary: "Get country-specific leaderboard" })
  @ApiResponse({ status: 200, description: "Country leaderboard retrieved successfully", type: LeaderboardResponseDto })
  async getCountryLeaderboard(
    @Param('country') country: string,
    @Query() query: LeaderboardQueryDto,
  ): Promise<LeaderboardResponseDto> {
    return this.leaderboardService.getCountryLeaderboard(country, query)
  }

  @Get('user/:userId/rank')
  @ApiOperation({ summary: 'Get user rank information' })
  @ApiResponse({ status: 200, description: 'User rank retrieved successfully' })
  async getUserRank(@Param('userId') userId: string) {
    return this.leaderboardService.getUserRank(userId);
  }
}
