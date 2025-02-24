import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from "typeorm"
import { UserProgress } from "src/user-progress/userprogress.entity"
import { Puzzles } from "src/puzzles/puzzles.entity"
import { User } from "src/users/users.entity"
import { Answers } from "src/answers/answers.entity"
@Entity()
export class Hints {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    () => Puzzles,
    (puzzles) => puzzles.hints,
  )
  puzzles: Puzzles

  // @OneToMany(
  //   () => UserProgress,
  //   (userProgress) => userProgress.hints,
  // )
  userProgress: UserProgress[]
  @ManyToOne(() => User, (user) => user.hints)
  user: User;

  @ManyToOne(() => Puzzles, (puzzle) => puzzle.hints)
  puzzle: Puzzles;

  @OneToOne(() => Answers, (answer) => answer.hints, { cascade: true })
  answer: Answers;
  
}

