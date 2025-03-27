import { Controller, Post, Get, Body, Param, UseGuards, Request, BadRequestException } from "@nestjs/common"
import type { AffiliateService } from "../services/affiliate.service"
import type { RegisterAffiliateDto } from "../dtos/register-affiliate.dto"
import type { RequestPayoutDto } from "../dtos/request-payout.dto"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard" // Adjust import path as needed

@Controller("affiliate")
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Post("register")
  @UseGuards(JwtAuthGuard)
  async register(@Request() req, @Body() registerAffiliateDto: RegisterAffiliateDto) {
    // Assuming req.user.id contains the authenticated user's ID
    const userId = req.user.id

    // Override the userId in the DTO with the authenticated user's ID for security
    registerAffiliateDto.userId = userId

    const affiliate = await this.affiliateService.registerAffiliate(registerAffiliateDto)

    return {
      success: true,
      message: "Successfully registered as an affiliate",
      data: {
        id: affiliate.id,
        referralCode: affiliate.referralCode,
        referralLink: `${process.env.APP_URL}/ref/${affiliate.referralCode}`,
      },
    }
  }

  @Get('referrals')
  @UseGuards(JwtAuthGuard)
  async getReferrals(@Request() req) {
    const userId = req.user.id;
    
    // Get affiliate by user ID
    const affiliate = await this.affiliateService.getAffiliateByUserId(userId);
    
    // Get referrals for this affiliate
    const referrals = await this.affiliateService.getReferrals(affiliate.id);
    
    return {
      success: true,
      data: referrals,
    };
  }

  @Get('payouts')
  @UseGuards(JwtAuthGuard)
  async getPayouts(@Request() req) {
    const userId = req.user.id;
    
    // Get affiliate by user ID
    const affiliate = await this.affiliateService.getAffiliateByUserId(userId);
    
    // Get payouts for this affiliate
    const payouts = await this.affiliateService.getPayouts(affiliate.id);
    
    return {
      success: true,
      data: payouts,
    };
  }

  @Post("request-payout")
  @UseGuards(JwtAuthGuard)
  async requestPayout(@Request() req, @Body() requestPayoutDto: RequestPayoutDto) {
    const userId = req.user.id

    // Get affiliate by user ID
    const affiliate = await this.affiliateService.getAffiliateByUserId(userId)

    // Request payout
    const payout = await this.affiliateService.requestPayout(affiliate.id, requestPayoutDto)

    return {
      success: true,
      message: "Payout request submitted successfully",
      data: payout,
    }
  }

  // This endpoint would typically be protected by an admin guard
  @Post("track-referral/:referralCode")
  async trackReferral(@Param('referralCode') referralCode: string, @Body('userId') referredUserId: string) {
    if (!referredUserId) {
      throw new BadRequestException("User ID is required")
    }

    const referral = await this.affiliateService.trackReferral(referralCode, referredUserId)

    return {
      success: true,
      message: "Referral tracked successfully",
      data: referral,
    }
  }
}

