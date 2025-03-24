import { Exclude, Expose, Transform } from "class-transformer"
import type { Transaction } from "../entities/transaction.entity"

@Exclude()
export class TransactionResponseDto {
  @Expose()
  id: string

  @Expose()
  type: string

  @Expose()
  currencyType: string

  @Expose()
  amount: number

  @Expose()
  description: string

  @Expose()
  walletId: string

  @Expose()
  recipientWalletId: string

  @Expose()
  referenceId: string

  @Expose()
  @Transform(({ obj }) => obj.createdAt.toISOString())
  createdAt: Date

  constructor(partial: Partial<Transaction>) {
    Object.assign(this, partial)
  }
}

