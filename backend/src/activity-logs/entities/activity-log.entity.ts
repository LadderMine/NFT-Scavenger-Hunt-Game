import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm"
import { ActivityAction, ActivitySeverity, ActivityCategory } from "../interfaces/activity-constants"

@Entity("activity_logs")
@Index(["userId", "createdAt"]) // Composite index for faster user-specific queries
@Index(["action", "createdAt"]) // Composite index for action-specific queries
@Index(["category", "createdAt"]) // Composite index for category-specific queries
@Index(["severity", "createdAt"]) // Composite index for severity-specific queries
export class ActivityLog {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid", nullable: true })
  @Index() // Index for faster userId lookups
  userId: string | null

  @Column({
    type: "enum",
    enum: ActivityAction,
  })
  action: ActivityAction

  @Column({
    type: "enum",
    enum: ActivityCategory,
    default: ActivityCategory.SYSTEM,
  })
  category: ActivityCategory

  @Column({
    type: "enum",
    enum: ActivitySeverity,
    default: ActivitySeverity.INFO,
  })
  severity: ActivitySeverity

  @Column({ type: "jsonb", default: {} })
  metadata: Record<string, any>

  @Column({ nullable: true })
  resourceType: string

  @Column({ nullable: true })
  resourceId: string

  @Column({ nullable: true })
  ipAddress: string

  @Column({ nullable: true })
  userAgent: string

  @Column({ nullable: true })
  sessionId: string

  @Column({ nullable: true })
  requestId: string

  @Column({ nullable: true })
  requestPath: string

  @Column({ nullable: true })
  requestMethod: string

  @Column({ nullable: true })
  statusCode: number

  @Column({ nullable: true })
  duration: number

  @Column({ nullable: true })
  geoLocation: string

  @Column({ default: false })
  isAnonymized: boolean

  @CreateDateColumn()
  @Index() // Index for faster date-based queries
  createdAt: Date
}

