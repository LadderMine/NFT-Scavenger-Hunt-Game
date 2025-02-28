import { Hints } from 'src/hints/hints.entity';
import { Puzzles } from 'src/puzzles/puzzles.entity';
import { User } from 'src/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';

@Entity()
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.userProgress)
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @ManyToOne(() => Puzzles, (puzzle) => puzzle.userProgress)
  @JoinColumn({ name: 'puzzleId' })
  puzzles: Puzzles;

  @ManyToOne(() => Hints, (hints) => hints.userProgress)
  hints: Relation<Hints>;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: 0 })
  hintsUsed: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;

  // New: List of completed level IDs stored as a comma-separated string
  @Column('simple-array', { nullable: true })
  completedLevels: number[];

  // New: Overall progress percentage
  @Column({ type: 'int', default: 0 })
  progressPercentage: number;
}
