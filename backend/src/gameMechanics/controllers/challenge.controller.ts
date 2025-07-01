import { Controller, Get, Post, Patch, Param, Delete, UseGuards } from "@nestjs/common"
import type { ChallengeService } from "../services/challenge.service"
import type { PuzzleService } from "../services/puzzle.service"
import type { CreateChallengeDto } from "../dto/create-challenge.dto"
import type { UpdateChallengeDto } from "../dto/update-challenge.dto"
import { AdminGuard } from "../guards/admin.guard"
import { AuthGuard } from "@nestjs/passport" // Assuming you have auth setup

@Controller("challenges")
@UseGuards(AuthGuard("jwt"))
export class ChallengeController {
  constructor(
    private readonly challengeService: ChallengeService,
    private readonly puzzleService: PuzzleService,
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  create(createChallengeDto: CreateChallengeDto) {
    return this.challengeService.create(createChallengeDto)
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.challengeService.findAll()
  }

  @Get("available")
  findAvailable() {
    return this.challengeService.findAvailableForUser()
  }

  @Get("daily")
  getDailyChallenge() {
    return this.challengeService.getDailyChallenge()
  }

  @Get("weekly")
  getWeeklyChallenge() {
    return this.challengeService.getWeeklyChallenge()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengeService.findOneForUser(id);
  }

  @Get(':id/stats')
  @UseGuards(AdminGuard)
  getChallengeStats(@Param('id') id: string) {
    return this.puzzleService.getChallengeStats(id);
  }

  @Patch(":id")
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, updateChallengeDto: UpdateChallengeDto) {
    return this.challengeService.update(id, updateChallengeDto)
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.challengeService.remove(id);
  }
}
