import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator"
import { RefundStatus } from "../entities/refund.entity"

export class FindRefundsDto {
  @IsOptional()
  @IsUUID()
  userId?: string

  @IsOptional()
  @IsUUID()
  orderId?: string

  @IsOptional()
  @IsEnum(RefundStatus)
  status?: RefundStatus

  @IsOptional()
  @IsString()
  startDate?: string

  @IsOptional()
  @IsString()
  endDate?: string

  @IsOptional()
  @IsString()
  searchTerm?: string

  @IsOptional()
  page?: number = 1

  @IsOptional()
  limit?: number = 10

  @IsOptional()
  @IsString()
  sortBy?: string = "createdAt"

  @IsOptional()
  @IsString()
  sortOrder?: "ASC" | "DESC" = "DESC"
}

