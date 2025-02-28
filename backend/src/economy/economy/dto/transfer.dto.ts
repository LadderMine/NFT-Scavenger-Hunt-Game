import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator"
import { CurrencyType } from "../entities/transaction.entity"

export class TransferDto {
  @IsUUID()
  @IsNotEmpty()
  recipientWalletId: string

  @IsEnum(CurrencyType)
  @IsNotEmpty()
  currencyType: CurrencyType

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  amount: number

  @IsString()
  @IsOptional()
  description?: string
}

