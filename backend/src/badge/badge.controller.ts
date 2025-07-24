import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { AssignBadgeDto } from './dto/assign-badge.dto';

@Controller('badges')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Post('assign')
  assignBadge(@Body() dto: AssignBadgeDto) {
    return this.badgeService.assignBadgeToUser(dto);
  }

  @Get('user/:id')
  getUserBadges(@Param('id') id: string) {
    return this.badgeService.getBadgesForUser(+id);
  }
}
