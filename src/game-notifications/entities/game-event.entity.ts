import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from "typeorm"
import { User } from "./user.entity"

export enum GameEventType {
  LEVEL_UP = "level_up",
  ACHIEVEMENT_UNLOCKED = "achievement_unlocked",
  MATCH_WON = "match_won",
  MATCH_LOST = "match_lost",
  FRIEND_REQUEST = "friend_request",
  GUILD_INVITATION = "guild_invitation",
  TOURNAMENT_START = "tournament_start",
  DAILY_REWARD = "daily_reward",
  SYSTEM_MAINTENANCE = "system_maintenance",
}

@Entity("game_events")
@Index(["userId", "eventType"])
@Index(["createdAt"])
export class GameEvent {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    type: "enum",
    enum: GameEventType,
  })
  eventType: GameEventType

  @Column()
  title: string

  @Column("text")
  description: string

  @Column("jsonb", { nullable: true })
  metadata: Record<string, any>

  @Column({ default: "medium" })
  priority: "low" | "medium" | "high" | "urgent"

  @Column("uuid")
  userId: string

  @ManyToOne(
    () => User,
    (user) => user.gameEvents,
  )
  @JoinColumn({ name: "userId" })
  user: User

  @Column({ default: false })
  processed: boolean

  @CreateDateColumn()
  createdAt: Date
}
