import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  action: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;
}
