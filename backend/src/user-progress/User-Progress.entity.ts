import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Puzzles } from '../puzzles/puzzles.entity';
// Assuming a User entity might exist, but for now, storing userId directly.
// import { User } from '../users/user.entity'; 

export enum PuzzleProgressStatus {
  STARTED = 'started',
  COMPLETED = 'completed',
  // FAILED = 'failed', // If applicable
}

@Entity()
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() // Or use @ManyToOne if you have a User entity
  userId: number; 
  // @ManyToOne(() => User, user => user.progress) 
  // user: User;

  @ManyToOne(() => Puzzles) // No inverse relation needed on Puzzles side for this typically
  puzzle: Puzzles; // This will store the specific puzzle version

  @Column()
  puzzleId: number; // Explicit column to store the ID of the puzzle version

  @Column({
    type: 'enum',
    enum: PuzzleProgressStatus,
    default: PuzzleProgressStatus.STARTED,
  })
  status: PuzzleProgressStatus;

  @Column({ type: 'int', nullable: true })
  score?: number;

  @CreateDateColumn()
  startedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date; 

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;
} 