import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column()
  @Index()
  actionType: string; // e.g., 'PUZZLE_ATTEMPT', 'QUIZ_SUBMISSION', 'REWARD_CLAIM'

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>; // Flexible structure

  @CreateDateColumn()
  timestamp: Date;
}
