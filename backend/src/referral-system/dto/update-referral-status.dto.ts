import { IsEnum, IsUUID } from "class-validator"
import { ReferralStatus } from "../entities/referral.entity"

export class UpdateReferralStatusDto {
  @IsUUID()
  referralId: string

  @IsEnum(ReferralStatus)
  status: ReferralStatus
}

