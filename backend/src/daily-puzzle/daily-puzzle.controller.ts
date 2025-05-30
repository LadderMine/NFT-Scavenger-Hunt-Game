import { Controller, Get } from '@nestjs/common';
import { DailyPuzzleService } from './daily-puzzle.service';

@Controller('daily-puzzle')
export class DailyPuzzleController {
  constructor(private readonly dailyPuzzleService: DailyPuzzleService) {}

  @Get('active')
  async getActiveDailyPuzzle() {
    return this.dailyPuzzleService.getActiveDailyPuzzle();
  }
}
