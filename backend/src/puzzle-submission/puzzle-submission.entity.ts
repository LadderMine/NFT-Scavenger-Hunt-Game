import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity()
@Index(['playerId', 'puzzleId'])
export class PuzzleSubmission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  playerId: string;

  @Column()
  puzzleId: string;

  @Column()
  answer: string;

  @Column({ default: false })
  isCorrect: boolean;

  @Column({ default: 1 })
  attemptCount: number;

  @CreateDateColumn()
  timestamp: Date;
}
