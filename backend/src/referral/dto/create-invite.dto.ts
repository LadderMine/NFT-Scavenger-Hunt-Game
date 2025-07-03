import { IsEmail, IsString, IsOptional, IsDateString } from "class-validator"

export class CreateInviteDto {
  @IsEmail()
  email: string

  @IsString()
  referralCode: string

  @IsOptional()
  @IsDateString()
  expiresAt?: string

  @IsOptional()
  metadata?: any
}
