import { Controller, Get, Post, Param, HttpCode, HttpStatus, Body } from "@nestjs/common"
import type { MilestoneService } from "../services/milestone.service"

@Controller("milestones")
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  @Get("my")
  async getMyMilestones() {
    // In a real app, you'd get userId from JWT token
    const req = { user: { id: "user-id-placeholder" } } // Mock request object
    const userId = req.user.id

    return this.milestoneService.getUserMilestones(userId)
  }

  @Get("my/stats")
  async getMyMilestoneStats() {
    // In a real app, you'd get userId from JWT token
    const req = { user: { id: "user-id-placeholder" } } // Mock request object
    const userId = req.user.id

    return this.milestoneService.getUserMilestoneStats(userId)
  }

  @Get("my/next")
  async getMyNextMilestones() {
    // In a real app, you'd get userId from JWT token
    const req = { user: { id: "user-id-placeholder" } } // Mock request object
    const userId = req.user.id

    return this.milestoneService.getNextMilestones(userId)
  }

  @Post("my/:milestoneId/view")
  @HttpCode(HttpStatus.OK)
  async markMilestoneAsViewed(@Param("milestoneId") milestoneId: string) {
    // In a real app, you'd get userId from JWT token
    const req = { user: { id: "user-id-placeholder" } } // Mock request object
    const userId = req.user.id

    await this.milestoneService.markMilestoneAsViewed(userId, milestoneId)
    return { success: true }
  }

  // Endpoint for external systems to trigger milestone checks
  @Post("trigger/puzzle-completed")
  @HttpCode(HttpStatus.OK)
  async triggerPuzzleCompleted(@Body() body: { userId: string; puzzleData?: any }) {
    return this.milestoneService.onPuzzleCompleted(body.userId, body.puzzleData)
  }

  @Post("trigger/streak-updated")
  @HttpCode(HttpStatus.OK)
  async triggerStreakUpdated(
    @Body() body: { userId: string; currentStreak: number; longestStreak: number },
  ) {
    return this.milestoneService.onStreakUpdated(body.userId, body.currentStreak, body.longestStreak)
  }
}
