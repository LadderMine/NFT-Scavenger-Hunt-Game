import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "../../users/entities/user.entity"
import { BoosterAchievement } from "./booster-achievement.entity"

@Entity("player_achievements")
export class PlayerAchievement {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User

  @Column()
  userId: string

  @ManyToOne(() => BoosterAchievement)
  @JoinColumn({ name: "achievementId" })
  achievement: BoosterAchievement

  @Column()
  achievementId: string

  @Column("int", { default: 0 })
  progress: number

  @Column("boolean", { default: false })
  isCompleted: boolean

  @Column({ nullable: true })
  completedAt: Date

  @Column("boolean", { default: false })
  isRewardClaimed: boolean

  @Column({ nullable: true })
  rewardClaimedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

