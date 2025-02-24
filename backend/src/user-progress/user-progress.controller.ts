import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UserProgressService } from './user-progress.service';

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
}
