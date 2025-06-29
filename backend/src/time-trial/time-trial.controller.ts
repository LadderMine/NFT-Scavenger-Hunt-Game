import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TimetrialService } from './providers/timetrial.service';

@Controller('time-trial')
export class TimeTrialController {
      constructor(private readonly timeTrialService: TimetrialService) {}

  @Post('start')
  startTrial(@Body() body: { userId: string; puzzleId: string }) {
    return this.timeTrialService.startTrial(body.userId, body.puzzleId);
  }

  @Post('submit/:id')
  submitTrial(@Param('id') id: string) {
    return this.timeTrialService.submitTrial(id);
  }

  @Get('results/:userId')
  getUserResults(@Param('userId') userId: string) {
    return this.timeTrialService.getResults(userId);
  }

  @Get('leaderboard/:puzzleId')
  getLeaderboard(@Param('puzzleId') puzzleId: string) {
    return this.timeTrialService.getLeaderboard(puzzleId);
  }
}
