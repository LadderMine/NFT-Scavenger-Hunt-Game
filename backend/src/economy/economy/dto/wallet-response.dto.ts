import { Exclude, Expose, Transform } from "class-transformer"
import type { Wallet } from "../entities/wallet.entity"

@Exclude()
export class WalletResponseDto {
  @Expose()
  id: string

  @Expose()
  points: number

  @Expose()
  tokens: number

  @Expose()
  userId: string

  @Expose()
  @Transform(({ obj }) => obj.createdAt.toISOString())
  createdAt: Date

  @Expose()
  @Transform(({ obj }) => obj.updatedAt.toISOString())
  updatedAt: Date

  constructor(partial: Partial<Wallet>) {
    Object.assign(this, partial)
  }
}

