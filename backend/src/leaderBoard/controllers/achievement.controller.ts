import { Controller, Get, Post } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import type { AchievementService } from "../services/achievement.service"
import { UserBadgesResponseDto } from "../dto/achievement-response.dto"

@ApiTags("Achievements")
@Controller("achievements")
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Get()
  @ApiOperation({ summary: "Get all available achievements" })
  @ApiResponse({ status: 200, description: "All achievements retrieved successfully" })
  async getAllAchievements() {
    return this.achievementService.getAllAchievements()
  }

  @Get("users/:userId/badges")
  @ApiOperation({ summary: "Get earned badges for a specific user" })
  @ApiResponse({ status: 200, description: "User badges retrieved successfully", type: UserBadgesResponseDto })
  async getUserBadges(userId: string): Promise<UserBadgesResponseDto> {
    return this.achievementService.getUserBadges(userId)
  }

  @Post("users/:userId/check")
  @ApiOperation({ summary: "Check and award new achievements for a user" })
  @ApiResponse({ status: 200, description: "Achievements checked and awarded" })
  async checkUserAchievements(userId: string) {
    const newAchievements = await this.achievementService.checkAndAwardAchievements(userId)
    return {
      message: "Achievements checked successfully",
      newAchievements: newAchievements.length,
      achievements: newAchievements,
    }
  }
}
