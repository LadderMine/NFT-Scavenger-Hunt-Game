import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator"
import { CurrencyType, TransactionType } from "../entities/transaction.entity"

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType

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

  @IsUUID()
  @IsOptional()
  recipientWalletId?: string

  @IsString()
  @IsOptional()
  referenceId?: string
}

