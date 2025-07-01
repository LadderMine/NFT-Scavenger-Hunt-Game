import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, Unique } from "typeorm"

@Entity("reactions")
@Unique(["userId", "contentId"]) // Ensure one reaction per user per content
@Index(["contentId"]) // Index for efficient aggregation queries
@Index(["userId"]) // Index for user-specific queries
export class Reaction {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  userId: string

  @Column({ type: "varchar", length: 255 })
  contentId: string

  @Column({ type: "varchar", length: 10 })
  emoji: string

  @CreateDateColumn()
  createdAt: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date
}
