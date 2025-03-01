import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { PuzzlesService } from 'src/puzzles/puzzles.service';
import { CreateScoreDto } from './dto/create-score.dto';

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

  @Post()
  async createScore(@Body() scoreDto: CreateScoreDto){
    return await this.scoresService.createScore(scoreDto);
  }


  @Get()
  async getAllScores(){
    return await this.scoresService.getAllScores();
  }

  @Get(':id') // Use ':id' to define a route parameter
  async getScore(@Param('id') id: number) {
    const result = await this.scoresService.findOneById(id);
    if (!result) {
      throw new NotFoundException(`Score with ID ${id} not found`);
    }
    return result; // Return the found score
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    return this.scoresService.deleteScore(id);
  }


  @Patch()
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
