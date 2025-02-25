import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { Puzzles } from "src/puzzles/puzzles.entity"
import { UserProgress } from "src/user-progress/user-progress.entity"

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}
@Entity()
export class Hints {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    () => Puzzles,
    (puzzles) => puzzles.hints, { onDelete: 'CASCADE' }
  )
  puzzles: Puzzles

  @OneToMany(
    () => UserProgress,
    (userProgress) => userProgress.hints
  )
  userProgress: UserProgress[]

  @Column()
  hintText: string;

  @Column({ type: 'enum', enum: DifficultyLevel, nullable: true })
  difficultyLevel?: DifficultyLevel;
}

