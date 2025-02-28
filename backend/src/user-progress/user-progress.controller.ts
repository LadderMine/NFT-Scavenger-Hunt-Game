import { UserProgressService } from './user-progress.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UserProgressDto } from './dto/user-progress.dto';

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

  // GET endpoint for user score
  @Get('user-score')
  async getUserScore(
    @Query('userId') userId: number,
    @Query('puzzleId') puzzleId: number,
  ): Promise<number> {
    if (!puzzleId) {
      throw new BadRequestException('Puzzle ID is required');
    }
    return this.userProgressService.getUserScore(userId);
  }

  // New endpoint: Mark puzzle as completed
  @Post('puzzle-completed')
  async puzzleCompleted(@Request() req, @Body() body: { puzzleId: number }) {
    return this.userProgressService.puzzleCompleted(req.user.id, body.puzzleId);
  }

  // New endpoint: Mark level as completed
  @Post('level-completed')
  async levelCompleted(@Request() req, @Body() body: { levelId: number }) {
    return this.userProgressService.levelCompleted(req.user.id, body.levelId);
  }
}
