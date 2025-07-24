import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ContentRatingService } from './content-rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('ratings')
export class ContentRatingController {
  constructor(private readonly ratingService: ContentRatingService) {}

  @Post()
  async rateContent(@Body() dto: CreateRatingDto) {
    return this.ratingService.rateContent(dto.userId, dto.contentId, dto.rating);
  }

  @Get('/stats')
  async getStats(@Query('contentId') contentId: string) {
    return this.ratingService.getContentRatingStats(contentId);
  }
}
