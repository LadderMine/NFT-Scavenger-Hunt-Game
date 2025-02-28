import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { PuzzleTranslation } from "./puzzle-translation.entity"

@Entity("puzzles")
export class Puzzle {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ length: 255 })
  identifier: string

  @Column({ length: 100 })
  type: string

  @Column({ default: true })
  isActive: boolean

  @Column({ type: "jsonb", nullable: true })
  defaultContent: Record<string, any>

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @OneToMany(
    () => PuzzleTranslation,
    (translation) => translation.puzzle,
  )
  translations: PuzzleTranslation[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

