import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { HintService } from './hint.service';

@Controller('hints')
export class HintController {
  constructor(private readonly hintService: HintService) {}

  @Get(':puzzleId')
  async getHints(
    @Param('puzzleId') puzzleId: string,
    @Query('startTime') startTime: string,
  ) {
    if (!startTime)
      throw new BadRequestException('startTime query param is required');

    const start = new Date(startTime).getTime();
    const now = Date.now();
    if (isNaN(start)) throw new BadRequestException('Invalid startTime format');

    const elapsedMinutes = Math.floor((now - start) / 60000);
    return this.hintService.getAvailableHints(puzzleId, elapsedMinutes);
  }
}
