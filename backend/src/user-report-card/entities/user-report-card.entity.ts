import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('report_cards')
export class ReportCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column('int', { default: 0 })
  completedPuzzles: number;

  @Column('int', { default: 0 })
  rewardsEarned: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  progressPercentage: number;

  @Column('int', { default: 0 })
  totalTimeSpent: number; // in minutes

  @Column('int', { default: 0 })
  streakDays: number;

  @Column('json', { nullable: true })
  categoryBreakdown: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };

  @Column('json', { nullable: true })
  recentAchievements: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}