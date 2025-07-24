import { IsOptional, IsDateString, IsBoolean } from "class-validator"

export class CreateReferralCodeDto {
  @IsOptional()
  @IsDateString()
  expiresAt?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
