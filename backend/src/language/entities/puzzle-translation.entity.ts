import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm"
import { Language } from "./language.entity"
import { Puzzle } from "./puzzle.entity"

@Entity("puzzle_translations")
@Index(["puzzleId", "languageId"], { unique: true })
export class PuzzleTranslation {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  puzzleId: string

  @ManyToOne(
    () => Puzzle,
    (puzzle) => puzzle.translations,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "puzzleId" })
  puzzle: Puzzle

  @Column({ type: "uuid" })
  languageId: string

  @ManyToOne(
    () => Language,
    (language) => language.puzzleTranslations,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "languageId" })
  language: Language

  @Column({ type: "jsonb" })
  content: Record<string, any>

  @Column({ default: false })
  isApproved: boolean

  @Column({ nullable: true, type: "uuid" })
  approvedBy: string

  @Column({ nullable: true })
  approvedAt: Date

  @Column({ nullable: true, type: "uuid" })
  createdBy: string

  @Column({ nullable: true, type: "uuid" })
  updatedBy: string

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

