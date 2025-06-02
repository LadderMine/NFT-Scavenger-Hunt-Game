import { IsEnum, IsString, IsOptional } from "class-validator"
import { FraudReviewStatus } from "../entities/fraud-suspect.entity"

export class UpdateFraudReviewDto {
  @IsEnum(FraudReviewStatus)
  status: FraudReviewStatus

  @IsString()
  reviewedBy: string

  @IsOptional()
  @IsString()
  reviewNotes?: string
}

