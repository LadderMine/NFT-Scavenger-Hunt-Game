import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  BadRequestException,
  UseGuards,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Scores } from './scores.entity';
import { Repository } from 'typeorm';

@Controller('scores')
export class ScoresController {
  constructor(
    private readonly scoresService: ScoresService,

    //repository injection of scores entity 
    @InjectRepository(Scores)
    private scoresRepository: Repository<Scores>
  ) {}

  // GET /scores?page=1&limit=10
  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getScores(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    return this.scoresService.getLeaderboard(pageNumber, limitNumber);
  }

  @Get('/:id')
  public getScoresBy(@Param('id', ParseIntPipe) id: number) {
    console.log(`Fetching user with ID: ${id}`);
    return this.scoresService.findOneById(id);
  }

  // POST /scores/update-score
  @Post('/update-score')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
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
