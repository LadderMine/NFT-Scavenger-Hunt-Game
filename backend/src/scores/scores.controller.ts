import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ScoresService } from './scores.service';

@Controller('scores')
export class ScoresController {
  constructor(private readonly socresSerivce: ScoresService) {}

  //GET method leaderboard? page=1&limit=10
  @Get()
  async getScores(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    return this.socresSerivce.getLeaderboard(pageNumber, limitNumber);
  }

  // POST /update-score
  @Post('/update-score')
  updateScore(@Body() body: { username: string; score: number }) {
    const { username, score } = body;
    return this.socresSerivce.updateScore(username, score);
  }
}
