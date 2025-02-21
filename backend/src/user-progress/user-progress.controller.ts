import { Controller, Get, Post, Body, UseGuards, Request } from "@nestjs/common"
import { UserProgressService } from "./user-progress.service";

@Controller("user-progress")
export class UserProgressController {
  constructor(private readonly userprogressService: UserProgressService) {}

  @Get()
  async getUserProgress(@Request() req) {
    return this.userprogressService.getUserProgress(req.user.id);
  }

  @Post("update")
  async updateProgress(
    @Request() req,
    @Body() updateProgressDto: { puzzleId: number; hintId: number | null; completed: boolean },
  ) {
    return this.userprogressService.updateProgress(
      req.user.id,
      updateProgressDto.puzzleId,
      updateProgressDto.hintId,
      updateProgressDto.completed,
    )
  }

  @Get('score')
  async getUserScore(@Request() req) {
    return this.userprogressService.getUserScore(req.user.id);
  }
}

