import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

export enum RewardType {
  BONUS = "bonus",
  XP = "xp",
  DISCOUNT = "discount",
}

export enum RewardStatus {
  PENDING = "pending",
  GRANTED = "granted",
  EXPIRED = "expired",
}

@Entity("rewards")
export class Reward {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("uuid")
  userId: string

  @Column({
    type: "enum",
    enum: RewardType,
  })
  type: RewardType

  @Column("numeric")
  value: number

  @Column({
    type: "enum",
    enum: RewardStatus,
    default: RewardStatus.PENDING,
  })
  status: RewardStatus

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

