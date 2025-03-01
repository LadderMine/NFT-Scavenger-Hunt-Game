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
  UseGuards
} from '@nestjs/common';
import { UserProgressDto } from './dto/user-progress.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from 'src/auth/enums/roles.enum';

@Controller('user-progress')
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @Get()
  async getUserProgress(@Request() req) {
    return this.userProgressService.getUserProgress(req.user.id);
  }

  @Post('update')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
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
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getUserScore(
    @Query('userId') userId: number,
    @Query('puzzleId') puzzleId: number,
  ): Promise<number> {
    if (!puzzleId) {
      throw new BadRequestException('Puzzle ID is required');
    }
    return this.userProgressService.getUserScore(userId);
  }

  @Post('puzzle-completed')
  async puzzleCompleted(@Request() req, @Body() body: { puzzleId: number }) {
    return this.userProgressService.puzzleCompleted(req.user.id, body.puzzleId);
  }

  @Post('level-completed')
  async levelCompleted(@Request() req, @Body() body: { levelId: number }) {
    return this.userProgressService.levelCompleted(req.user.id, body.levelId);

  @Get(':userId/level/:levelId')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getLevelProgress(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('levelId', ParseIntPipe) levelId: string,
  ) {
    return this.userProgressService.getLevelProgress(userId, levelId);
  }

  @Get(':userId/level/:levelId/solved')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getSolvedPuzzlesInLevel(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('levelId', ParseIntPipe) levelId: string,
  ): Promise<number> {
    return this.userProgressService.getSolvedPuzzlesInLevel(userId, levelId);
  }
}
