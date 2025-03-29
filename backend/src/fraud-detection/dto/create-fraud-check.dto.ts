import { IsString, IsOptional, IsObject, IsIP, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

export class ReferralData {
  @IsString()
  referralCode: string

  @IsString()
  referrerId: string
}

export class CreateFraudCheckDto {
  @IsString()
  userId: string

  @IsIP()
  ipAddress: string

  @IsString()
  deviceFingerprint: string

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>

  @IsOptional()
  @ValidateNested()
  @Type(() => ReferralData)
  referralData?: ReferralData
}

