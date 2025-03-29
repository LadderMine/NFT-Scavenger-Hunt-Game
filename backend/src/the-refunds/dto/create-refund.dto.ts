import { IsNotEmpty, IsString, IsUUID } from "class-validator"

export class CreateRefundDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string

  @IsString()
  @IsNotEmpty()
  reason: string
}

