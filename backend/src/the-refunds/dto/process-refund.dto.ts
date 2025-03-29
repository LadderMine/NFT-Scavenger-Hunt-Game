import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { RefundStatus } from "../entities/refund.entity"

export class ProcessRefundDto {
  @IsEnum(RefundStatus)
  @IsNotEmpty()
  status: RefundStatus

  @IsOptional()
  @IsString()
  adminNotes?: string
}

