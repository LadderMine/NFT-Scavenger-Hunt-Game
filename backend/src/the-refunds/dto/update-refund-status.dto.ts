import { IsEnum, IsNotEmpty } from "class-validator"
import { RefundStatus } from "../entities/refund.entity"

export class UpdateRefundStatusDto {
  @IsEnum(RefundStatus)
  @IsNotEmpty()
  status: RefundStatus
}

