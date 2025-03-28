import { IsEnum, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { ReferralStatus } from "../entities/referral.entity"

export class UpdateReferralDto {
  @ApiProperty({
    description: "Status of the referral",
    enum: ReferralStatus,
    example: ReferralStatus.COMPLETED,
  })
  @IsEnum(ReferralStatus)
  @IsOptional()
  status?: ReferralStatus
}

