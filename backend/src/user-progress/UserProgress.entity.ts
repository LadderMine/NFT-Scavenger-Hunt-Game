import { Hints } from "../hints/hints.entity"
import { Puzzles } from "../puzzles/puzzles.entity"
import { User } from "../users/users.entity"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"

@Entity()
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    () => User,
    (user) => user.userProgress,
    { onDelete: 'CASCADE' } // Adding cascade delete for data integrity.
  )
  @JoinColumn({ name: "userId" })
  user: User // Changed from Relation<User> to User

  @ManyToOne(
    () => Puzzles,
    (puzzles) => puzzles.userProgress,
  )
  @JoinColumn({ name: "puzzleId" })
  puzzles: Puzzles

  @ManyToOne(
    () => Hints,
    (hints) => hints.userProgress,
    { onDelete: 'SET NULL' } // Adding appropriate deletion behavior
  )
  @JoinColumn({ name: "hintId" }) // Added missing JoinColumn
  hints: Hints // Changed from Relation<Hints> to Hints

  @Column({ default: false })
  completed: boolean

  @Column({ default: 0 })
  hintsUsed: number

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  lastUpdated: Date
}
