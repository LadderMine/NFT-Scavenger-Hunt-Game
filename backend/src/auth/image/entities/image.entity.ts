import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

export enum ImageFormat {
  JPEG = "jpeg",
  PNG = "png",
  WEBP = "webp",
  GIF = "gif",
}

export enum ProcessingStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

@Entity("images")
export class Image {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ nullable: false })
  @Index()
  filename: string

  @Column({ nullable: false })
  originalName: string

  @Column({ nullable: false })
  mimeType: string

  @Column({ type: "enum", enum: ImageFormat, nullable: false })
  format: ImageFormat

  @Column({ nullable: false })
  size: number

  @Column({ nullable: false })
  width: number

  @Column({ nullable: false })
  height: number

  @Column({ nullable: true })
  description: string

  @Column({ nullable: false })
  path: string

  @Column({ nullable: true })
  publicUrl: string

  @Column({ type: "enum", enum: ProcessingStatus, default: ProcessingStatus.PENDING })
  status: ProcessingStatus

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @Column({ type: "jsonb", nullable: true })
  processingOptions: Record<string, any>

  @Column({ type: "jsonb", nullable: true })
  variants: Record<string, any>[]

  @Column({ default: false })
  isOptimized: boolean

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

