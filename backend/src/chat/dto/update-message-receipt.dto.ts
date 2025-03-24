import { IsEnum, IsNotEmpty, IsUUID } from "class-validator"
import { ReceiptStatus } from "../entities/message-receipt.entity"

export class UpdateMessageReceiptDto {
  @IsUUID("4")
  @IsNotEmpty()
  messageId: string

  @IsEnum(ReceiptStatus)
  @IsNotEmpty()
  status: ReceiptStatus
}

