import { IsUUID, IsOptional, IsDateString } from "class-validator"

export class ReferralEarningsQueryDto {
  @IsUUID()
  @IsOptional()
  userId?: string

  @IsDateString()
  @IsOptional()
  startDate?: string

  @IsDateString()
  @IsOptional()
  endDate?: string
}

export class ReferralEarningsResponseDto {
  userId: string
  totalEarnings: number
  tier1Earnings: number
  tier2Earnings: number
  tier3Earnings: number
  referrals: {
    tier: number
    count: number
  }[]
}

