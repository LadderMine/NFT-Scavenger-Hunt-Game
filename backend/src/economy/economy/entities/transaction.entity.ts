import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { Wallet } from "./wallet.entity"

export enum TransactionType {
  POINTS_EARNED = "POINTS_EARNED",
  POINTS_SPENT = "POINTS_SPENT",
  POINTS_TRANSFERRED = "POINTS_TRANSFERRED",
  TOKENS_PURCHASED = "TOKENS_PURCHASED",
  TOKENS_SPENT = "TOKENS_SPENT",
  TOKENS_TRANSFERRED = "TOKENS_TRANSFERRED",
}

export enum CurrencyType {
  POINTS = "POINTS",
  TOKENS = "TOKENS",
}

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    type: "enum",
    enum: TransactionType,
  })
  type: TransactionType

  @Column({
    type: "enum",
    enum: CurrencyType,
  })
  currencyType: CurrencyType

  @Column()
  amount: number

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true, name: "reference_id" })
  referenceId: string

  @ManyToOne(
    () => Wallet,
    (wallet) => wallet.transactions,
  )
  @JoinColumn({ name: "wallet_id" })
  wallet: Wallet

  @Column({ name: "wallet_id" })
  walletId: string

  @Column({ nullable: true, name: "recipient_wallet_id" })
  recipientWalletId: string

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date
}

