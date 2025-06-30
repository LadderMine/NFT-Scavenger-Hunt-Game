import { Puzzle } from 'src/puzzle/puzzle.entity';
import { User } from 'src/puzzle/puzzle.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class TimeTrial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column()
  @Index()
  puzzleId: string;

  @ManyToOne(() => User, user => user.timeTrials)
  user: User;

  @ManyToOne(() => Puzzle, puzzle => puzzle.timeTrials)
  puzzle: Puzzle;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}