import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Puzzles } from 'src/puzzles/puzzles.entity';
import { Scores } from 'src/scores/scores.entity';
import { User } from 'src/users/users.entity';

@Entity()
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userProgress, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Scores, (score) => score.userProgress)
  scores: Scores[];
  @ManyToOne(() => Puzzles, (puzzle) => puzzle.userProgress, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'puzzleId' })
  puzzle: Puzzles;
  // @ManyToOne(() => UserProgress, (userProgress) => userProgress.hints, { onDelete: 'CASCADE' })
  // userProgress: UserProgress;

  @ManyToOne(() => Scores, (score) => score.userProgress, { cascade: true, eager: true })
  @JoinColumn({ name: 'scoreId' })
  score: Scores;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: 0 })
  hintsUsed: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;
}
