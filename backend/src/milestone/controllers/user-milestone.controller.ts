import { Controller, Get } from "@nestjs/common"
import type { MilestoneService } from "../services/milestone.service"

@Controller("users")
export class UserMilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  @Get(":id/milestones")
  async getUserMilestones(userId: string) {
    return this.milestoneService.getUserMilestones(userId)
  }

  @Get(":id/milestones/stats")
  async getUserMilestoneStats(userId: string) {
    return this.milestoneService.getUserMilestoneStats(userId)
  }
}
