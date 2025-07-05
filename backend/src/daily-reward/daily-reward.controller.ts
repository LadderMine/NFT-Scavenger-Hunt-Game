import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { DailyRewardService } from './daily-reward.service';
import { DailyCheckinDto } from './dto/daily-checkin.dto';

@Controller('rewards')
export class DailyRewardController {
  constructor(private readonly dailyRewardService: DailyRewardService) {}

  @Post('daily-checkin')
  @UsePipes(new ValidationPipe({ transform: true }))
  dailyCheckIn(@Body() dailyCheckinDto: DailyCheckinDto) {
    return this.dailyRewardService.dailyCheckIn(dailyCheckinDto.userId);
  }
}