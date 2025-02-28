import { Body, Controller, Get, Post, Query, BadRequestException } from '@nestjs/common';
import { ScoresService } from './scores.service';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  // GET /scores?page=1&limit=10
  @Get()
  async getScores(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    return this.scoresService.getLeaderboard(pageNumber, limitNumber);
  }

  // POST /scores/update-score
  @Post('/update-score')
  async updateScore(@Body() body: { username: string; score: number }) {
    const { username, score } = body;
    try {
      // Calls the service which checks if the new score is greater than the existing score.
      const updatedUser = await this.scoresService.updateScore(username, score);
      return updatedUser;
    } catch (error) {
      // Returns a 400 Bad Request with the validation error message if the score update fails.
      throw new BadRequestException(error.message);
    }
  }
}
