import { IsEnum, IsOptional, IsString, IsDateString } from "class-validator"
import { FraudReviewStatus } from "../entities/fraud-suspect.entity"

export class FraudSuspectQueryDto {
  @IsOptional()
  @IsEnum(FraudReviewStatus)
  status?: FraudReviewStatus

  @IsOptional()
  @IsString()
  ipAddress?: string

  @IsOptional()
  @IsDateString()
  fromDate?: string

  @IsOptional()
  @IsDateString()
  toDate?: string

  @IsOptional()
  @IsString()
  userId?: string
}

