import { Controller, Get, Param } from '@nestjs/common';
import { ReferralsService } from './referrals.service';

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Get('stats')
  async getReferralStats() {
    return this.referralsService.getReferralStats();
  }

  @Get(':id')
  async getUserReferralDetails(@Param('id') userId: string) {
    return this.referralsService.getUserReferralDetails(userId);
  }
} 