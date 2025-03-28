import { IsString, IsUUID, IsNotEmpty } from "class-validator"

export class ApplyReferralDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsUUID()
  referredId: string
}

