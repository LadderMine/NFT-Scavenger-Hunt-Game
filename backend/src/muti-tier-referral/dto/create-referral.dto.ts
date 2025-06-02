import { IsUUID, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateReferralDto {
  @IsUUID()
  @IsNotEmpty()
  referrerId: string

  @IsUUID()
  @IsNotEmpty()
  refereeId: string

  @IsString()
  @IsOptional()
  code?: string
}

