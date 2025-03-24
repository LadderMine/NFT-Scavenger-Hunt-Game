import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { BoosterBundle } from "./booster-bundle.entity"

export enum BoosterType {
  HINT = "hint",
  SKIP = "skip",
  TIME_EXTENSION = "time_extension",
  DOUBLE_POINTS = "double_points",
  REVEAL_ANSWER = "reveal_answer",
  RETRY = "retry",
}

export enum BoosterRarity {
  COMMON = "common",
  UNCOMMON = "uncommon",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
}

@Entity("boosters")
export class Booster {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column("text")
  description: string

  @Column({
    type: "enum",
    enum: BoosterType,
  })
  type: BoosterType

  @Column("int")
  value: number

  @Column("int", { default: 1 })
  duration: number

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  price: number

  @Column({
    type: "enum",
    enum: BoosterRarity,
    default: BoosterRarity.COMMON,
  })
  rarity: BoosterRarity

  @Column("int", { default: 0 })
  cooldownSeconds: number

  @Column("boolean", { default: false })
  isLimited: boolean

  @Column("int", { nullable: true })
  dailyUsageLimit: number

  @Column("int", { nullable: true })
  weeklyUsageLimit: number

  @Column("boolean", { default: true })
  isActive: boolean

  @Column("boolean", { default: false })
  isGiftable: boolean

  @OneToMany(
    () => BoosterBundle,
    (boosterBundle) => boosterBundle.booster,
  )
  boosterBundles: BoosterBundle[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

