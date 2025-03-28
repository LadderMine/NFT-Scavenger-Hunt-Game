import { IsUUID, IsOptional, IsDateString } from "class-validator"

export class CreateReferralCodeDto {
  @IsUUID()
  userId: string

  @IsOptional()
  @IsDateString()
  expiresAt?: Date
}

