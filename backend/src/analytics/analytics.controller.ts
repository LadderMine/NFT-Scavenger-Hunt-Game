import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

class RecordSolveDto {
  userId: string;
  puzzleId: string;
  solveTime: number;
}

@Controller('analytics')
export class AnalyticsController {
  private readonly logger = new Logger(AnalyticsController.name);

  constructor(private readonly analyticsService: AnalyticsService) {
    this.analyticsService.seedData();
  }

  @Post('record-solve')
  @HttpCode(HttpStatus.NO_CONTENT)
  recordSolve(@Body() body: RecordSolveDto): void {
    this.logger.log(`Received record-solve request: ${JSON.stringify(body)}`);
    const { userId, puzzleId, solveTime } = body;
    this.analyticsService.recordPuzzleSolve(userId, puzzleId, solveTime);
  }

  @Get('puzzles/most-solved')
  getMostSolvedPuzzles(): Array<{ puzzleId: string; solveCount: number }> {
    this.logger.log('Handling request for most solved puzzles.');
    return this.analyticsService.getMostSolvedPuzzles();
  }

  @Get('puzzles/:puzzleId/average-solve-time')
  getAverageSolveTime(@Param('puzzleId') puzzleId: string): {
    puzzleId: string;
    averageSolveTime: number;
  } {
    this.logger.log(
      `Handling request for average solve time for puzzle ${puzzleId}.`,
    );
    const averageSolveTime =
      this.analyticsService.getAverageSolveTime(puzzleId);
    return { puzzleId, averageSolveTime };
  }

  @Get('users/:userId/history')
  getUserPuzzleHistory(@Param('userId') userId: string): Record<string, any> {
    this.logger.log(`Handling request for user ${userId} puzzle history.`);
    const userHistoryMap = this.analyticsService.getUserPuzzleStats(userId);

    const userHistoryObject = {};
    userHistoryMap.forEach((value, key) => {
      userHistoryObject[key] = value;
    });
    return userHistoryObject;
  }
}
