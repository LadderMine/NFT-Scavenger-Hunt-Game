import { Controller, Get, Post, Body, Query, Param, HttpStatus, HttpException } from "@nestjs/common"
import type { ReferralService } from "./referral.service"
import type { CreateReferralDto } from "./dto/create-referral.dto"
import type { ReferralEarningsQueryDto, ReferralEarningsResponseDto } from "./dto/referral-earnings.dto"
import type { ReferralTreeQueryDto, ReferralTreeResponseDto } from "./dto/referral-tree.dto"

@Controller("referrals")
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post()
  async createReferral(@Body() createReferralDto: CreateReferralDto) {
    try {
      return await this.referralService.createReferral(createReferralDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create referral',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('code/:code')
  async getReferralByCode(@Param('code') code: string) {
    const referral = await this.referralService.getReferralByCode(code);
    if (!referral) {
      throw new HttpException('Referral not found', HttpStatus.NOT_FOUND);
    }
    return referral;
  }

  @Get('earnings')
  async getReferralEarnings(
    @Query() query: ReferralEarningsQueryDto,
  ): Promise<ReferralEarningsResponseDto> {
    try {
      return await this.referralService.getReferralEarnings(query);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get referral earnings',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('tree')
  async getReferralTree(
    @Query() query: ReferralTreeQueryDto,
  ): Promise<ReferralTreeResponseDto> {
    try {
      return await this.referralService.getReferralTree(query);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get referral tree',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user/:userId')
  async getUserReferrals(@Param('userId') userId: string) {
    try {
      return await this.referralService.getUserReferrals(userId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get user referrals',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

