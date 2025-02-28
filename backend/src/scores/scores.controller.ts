import { Controller, Get, Post, Body, Param, Query, NotFoundException } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { PuzzlesService } from 'src/puzzles/puzzles.service';

@Controller('scores')
export class ScoresController {
  constructor(
    private readonly scoresService: ScoresService,
    private readonly puzzlesService: PuzzlesService,
  ) {}

  @Get('/leaderboard')
  async getLeaderboard(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.scoresService.getLeaderboard(page, limit);
  }

  @Post('/update')
  async updateScore(
    @Body('username') username: string,
    @Body('puzzleId') puzzleId: number,
    @Body('score') score: number,
  ) {
    if (!puzzleId) {
      throw new NotFoundException('Puzzle ID is required.');
    }

    return this.scoresService.updateScore(username, puzzleId, score);
  }

  @Post('/handle-puzzle-deletion/:puzzleId')
  async handlePuzzleDeletion(@Param('puzzleId') puzzleId: number) {
    return this.scoresService.handlePuzzleDeletion(puzzleId);
  }
}
