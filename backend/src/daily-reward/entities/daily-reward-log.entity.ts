import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('daily_reward_logs')
export class DailyRewardLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  userId: string;

  @Column({ default: 1 })
  streak: number;

  @CreateDateColumn()
  timestamp: Date;
}