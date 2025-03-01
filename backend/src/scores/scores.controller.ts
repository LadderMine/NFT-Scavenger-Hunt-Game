import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';

@Controller('scores')
export class ScoresController {

  constructor(private readonly scoresService: ScoresService) {}

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
    const result = await this.scoresService.getById(id);
    if (!result) {
      throw new NotFoundException(`Score with ID ${id} not found`);
    }
    return result; // Return the found score
  }

  @Patch(":id")
  async update(@Param("id") id: number, @Body() updateScoreDto: UpdateScoreDto) {
    return this.scoresService.updateScore(id, updateScoreDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    return this.scoresService.deleteScore(id);
  }


  // async getScores(
  //   @Query('page') page: string = '1',
  //   @Query('limit') limit: string = '10',
  // ) {
  //   const pageNumber = parseInt(page, 10);
  //   const limitNumber = parseInt(limit, 10);

  //   return this.socresSerivce.getLeaderboard(pageNumber, limitNumber);
  // }

  // POST /update-score
  // @Post('/update-score')
  // updateScore(@Body() body: { username: string; score: number }) {
  //   const { username, score } = body;
  //   return this.socresSerivce.updateScore(username, score);
  // }
}
