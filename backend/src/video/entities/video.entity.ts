import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { User } from "../../user/entities/user.entity"

export enum VideoStatus {
  PROCESSING = "processing",
  READY = "ready",
  FAILED = "failed",
}

export enum VideoVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
  UNLISTED = "unlisted",
}

@Entity("videos")
export class Video {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ length: 255 })
  title: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ length: 500 })
  fileUrl: string

  @Column({ length: 500, nullable: true })
  thumbnailUrl: string

  @Column({ type: "int", default: 0 })
  duration: number // in seconds

  @Column({ type: "enum", enum: VideoStatus, default: VideoStatus.PROCESSING })
  status: VideoStatus

  @Column({ type: "enum", enum: VideoVisibility, default: VideoVisibility.PRIVATE })
  visibility: VideoVisibility

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @Column({ type: "int", default: 0 })
  views: number

  @Column({ nullable: true })
  userId: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User

  @Column({ default: false })
  isTranscoded: boolean

  @Column({ nullable: true })
  cdnUrl: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

