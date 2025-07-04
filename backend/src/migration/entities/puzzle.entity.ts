import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity("puzzles")
@Index(["title", "category"], { unique: true })
export class Puzzle {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ length: 255 })
  title: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({
    type: "enum",
    enum: ["easy", "medium", "hard", "expert"],
    default: "medium",
  })
  difficulty: "easy" | "medium" | "hard" | "expert"

  @Column({ length: 100 })
  category: string

  @Column({ type: "json" })
  content: {
    question: string
    answer: string
    hints?: string[]
    explanation?: string
    options?: string[]
    type: "text" | "multiple_choice" | "code" | "math" | "logic"
  }

  @Column({ type: "json", nullable: true })
  metadata: {
    author?: string
    source?: string
    createdAt?: string
    estimatedTime?: number
    points?: number
  }

  @Column({ type: "simple-array", nullable: true })
  tags: string[]

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
