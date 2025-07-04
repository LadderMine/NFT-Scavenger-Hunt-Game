import { Controller, Post, UseGuards, Get } from "@nestjs/common"
import type { PuzzleService } from "../services/puzzle.service"
import type { RateLimitService } from "../services/rate-limit.service"
import { RateLimitGuard } from "../guards/rate-limit.guard"
import { AuthGuard } from "@nestjs/passport"

@Controller("puzzles")
@UseGuards(AuthGuard("jwt"))
export class PuzzleController {
  constructor(
    private readonly puzzleService: PuzzleService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  @Post("submit")
  @UseGuards(RateLimitGuard)
  async submitAnswer(req: any) {
    const userId = req.user.id
    const ipAddress = req.ip
    const submitPuzzleDto = req.body

    return this.puzzleService.submitAnswer(userId, submitPuzzleDto, ipAddress)
  }

  @Post("hint")
  async requestHint(req: any) {
    const userId = req.user.id
    const requestHintDto = req.body
    return this.puzzleService.requestHint(userId, requestHintDto)
  }

  @Get("progress")
  async getUserProgress(req: any) {
    const userId = req.user.id
    return this.puzzleService.getUserProgress(userId)
  }

  @Get("rate-limit-status")
  async getRateLimitStatus(req: any) {
    const userId = req.user.id
    return this.rateLimitService.getRateLimitStatus(userId)
  }
}
