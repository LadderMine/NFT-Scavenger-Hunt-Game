import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { ActivityType } from './enum/activityType.enum';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  sessionId: string;

  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @Column({ type: 'enum', enum: ActivityType })
  activityType: ActivityType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date | null;
}
