import { Controller, Post, Body, Get, Param, Query, ParseIntPipe, DefaultValuePipe, ValidationPipe } from '@nestjs/common';
import { PuzzleAccessLogService } from './puzzle-access-log.service';
import { LogAccessDto } from './dto/log-access.dto';

@Controller('puzzle-access')
export class PuzzleAccessLogController {
  constructor(private readonly accessLogService: PuzzleAccessLogService) {}

  @Post('log')
  logAccess(@Body(new ValidationPipe()) dto: LogAccessDto) {
    return this.accessLogService.logAccess(dto);
  }

  @Get('analytics/most-accessed')
  getMostAccessedPuzzles() {
    return this.accessLogService.getMostAccessedPuzzles();
  }

  @Get('analytics/unique-users/:puzzleId')
  getUniqueUsersPerPuzzle(@Param('puzzleId') puzzleId: string) {
    return this.accessLogService.getUniqueUsersPerPuzzle(puzzleId);
  }

  @Get('analytics/trends')
  getTimeBasedTrends(
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
  ) {
    return this.accessLogService.getTimeBasedTrends(days);
  }
}