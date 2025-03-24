import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm"
import { Booster } from "./booster.entity"
import { User } from "../../users/entities/user.entity"

@Entity("player_boosters")
@Index(["userId", "boosterId"])
export class PlayerBooster {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User

  @Column()
  userId: string

  @ManyToOne(() => Booster)
  @JoinColumn({ name: "boosterId" })
  booster: Booster

  @Column()
  boosterId: string

  @Column("int")
  quantity: number

  @Column({ nullable: true })
  expiresAt: Date

  @Column("jsonb", { nullable: true })
  metadata: Record<string, any>

  @Column("int", { default: 0 })
  totalUsed: number

  @Column("int", { default: 0 })
  dailyUsed: number

  @Column("int", { default: 0 })
  weeklyUsed: number

  @Column({ nullable: true })
  lastUsedAt: Date

  @Column({ nullable: true })
  lastDailyReset: Date

  @Column({ nullable: true })
  lastWeeklyReset: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

