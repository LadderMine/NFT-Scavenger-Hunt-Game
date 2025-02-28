import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { Booster } from "./booster.entity"

@Entity("booster_achievements")
export class BoosterAchievement {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column("text")
  description: string

  @Column("text")
  requirement: string

  @Column("int")
  threshold: number

  @ManyToOne(() => Booster)
  @JoinColumn({ name: "rewardBoosterId" })
  rewardBooster: Booster

  @Column()
  rewardBoosterId: string

  @Column("int")
  rewardQuantity: number

  @Column("boolean", { default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

