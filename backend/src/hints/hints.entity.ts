import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { UserProgress } from "src/user-progress/userprogress.entity"
import { Puzzles } from "src/puzzles/puzzles.entity"
@Entity()
export class Hints {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    () => Puzzles,
    (puzzles) => puzzles.hints,
  )
  puzzles: Puzzles

  @OneToMany(
    () => UserProgress,
    (userProgress) => userProgress.hints,
  )
  userProgress: UserProgress[]
}

