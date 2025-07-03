import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

export enum TargetType {
  PUZZLE = "Puzzle",
  APP = "App",
  EDUCATION = "Education",
}

@Entity("feedback")
@Index(["targetType", "createdAt"])
@Index(["rating", "createdAt"])
export class Feedback {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    type: "int",
    width: 1,
  })
  rating: number // 1-5 scale

  @Column({
    type: "text",
    nullable: true,
  })
  comment: string

  @Column({
    type: "enum",
    enum: TargetType,
  })
  targetType: TargetType

  @Column({
    type: "uuid",
    nullable: true,
  })
  userId: string // null if anonymous

  @Column({
    type: "uuid",
    nullable: true,
  })
  targetId: string // ID of the puzzle/content being reviewed (optional)

  @Column({
    default: false,
  })
  isAnonymous: boolean

  @Column({
    type: "json",
    nullable: true,
  })
  metadata: {
    userAgent?: string
    ipAddress?: string
    deviceInfo?: string
    appVersion?: string
    [key: string]: any
  }

  @Column({
    default: false,
  })
  isResolved: boolean

  @Column({
    type: "text",
    nullable: true,
  })
  adminNotes: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
