import { Controller, Post, Get, Body, Param, Put } from "@nestjs/common"
import type { ReferralService } from "./referral.service"
import type { CreateReferralCodeDto } from "./dto/create-referral-code.dto"
import type { ApplyReferralDto } from "./dto/apply-referral.dto"
import type { UpdateReferralStatusDto } from "./dto/update-referral-status.dto"
import type { ReferralCode } from "./entities/referral-code.entity"
import type { Referral } from "./entities/referral.entity"

@Controller("referrals")
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post('codes')
  async createReferralCode(@Body() createReferralCodeDto: CreateReferralCodeDto): Promise<ReferralCode> {
    return this.referralService.createReferralCode(createReferralCodeDto);
  }

  @Get('codes/user/:userId')
  async getUserReferralCodes(@Param('userId') userId: string): Promise<ReferralCode[]> {
    return this.referralService.getUserReferralCodes(userId);
  }

  @Get('codes/:code')
  async getReferralCodeByCode(@Param('code') code: string): Promise<ReferralCode> {
    return this.referralService.getReferralCodeByCode(code);
  }

  @Post('apply')
  async applyReferralCode(@Body() applyReferralDto: ApplyReferralDto): Promise<Referral> {
    return this.referralService.applyReferralCode(applyReferralDto);
  }

  @Put('status')
  async updateReferralStatus(@Body() updateReferralStatusDto: UpdateReferralStatusDto): Promise<Referral> {
    return this.referralService.updateReferralStatus(updateReferralStatusDto);
  }

  @Get('user/:userId')
  async getUserReferrals(@Param('userId') userId: string): Promise<Referral[]> {
    return this.referralService.getUserReferrals(userId);
  }

  @Get('stats/user/:userId')
  async getUserReferralStats(@Param('userId') userId: string): Promise<any> {
    return this.referralService.getUserReferralStats(userId);
  }
}

