import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm"
import { User } from "../../users/entities/user.entity"
import { Transaction } from "./transaction.entity"

@Entity("wallets")
export class Wallet {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ default: 0 })
  points: number

  @Column({ default: 0 })
  tokens: number

  @ManyToOne(
    () => User,
    (user) => user.wallets,
  )
  @JoinColumn({ name: "user_id" })
  user: User

  @Column({ name: "user_id" })
  userId: string

  @OneToMany(
    () => Transaction,
    (transaction) => transaction.wallet,
  )
  transactions: Transaction[]

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}

