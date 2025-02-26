import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Puzzles } from '../puzzles/puzzles.entity';
import { Hints } from '../hints/hints.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.answers, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Puzzles, (puzzle) => puzzle.answers, { onDelete: 'CASCADE' })
  puzzle: Puzzles;

  @ManyToOne(() => Hints, (hint) => hint.answers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  hint?: Hints;
}
