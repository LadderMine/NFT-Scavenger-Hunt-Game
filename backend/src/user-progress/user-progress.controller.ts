import { UserProgressService } from './user-progress.service';
import { Controller, Get, Post, Body, Param, ParseIntPipe, Request, Query, BadRequestException } from "@nestjs/common";
import { UserProgressDto } from "./dto/user-progress.dto";

@Controller('user-progress')
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}
  
  @Get()
  async getUserProgress(@Request() req) {
    return this.userProgressService.getUserProgress(req.user.id);
  }

  @Post('update')
  async updateProgress(
    @Request() req,
    @Body()
    updateProgressDto: {
      puzzleId: number;
      hintId: number | null;
      completed: boolean;
    },
  ) {
    return this.userProgressService.updateProgress(
      req.user.id,
      updateProgressDto.puzzleId,
      updateProgressDto.hintId,
      updateProgressDto.completed,
    );
  }

  //get user-score endpoint
  @Get('user-score')
  async getUserScore(
    @Query('userId') userId: number,
    @Query('puzzleId') puzzleId: number,
  ): Promise<number> {
    if (!puzzleId) {
      throw new BadRequestException('Puzzle ID is required');
    }

    return this.userProgressService.getUserScore(userId, puzzleId);
  }

  @Get(':userId/level/:levelId')
  async getLevelProgress(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('levelId', ParseIntPipe) levelId: string
  ) {
    return this.userProgressService.getLevelProgress(userId, levelId);
  }

   @Get(':userId/level/:levelId/solved')
  async getSolvedPuzzlesInLevel(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('levelId', ParseIntPipe) levelId: string
  ): Promise<number> {
    return this.userProgressService.getSolvedPuzzlesInLevel(userId, levelId);
  }
}

