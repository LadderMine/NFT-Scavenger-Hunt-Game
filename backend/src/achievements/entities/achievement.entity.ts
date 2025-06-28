// src/achievements/entities/achievement.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum RuleType {
  PUZZLE_COMPLETION_TIME = 'puzzle_completion_time',
  LOGIN_STREAK = 'login_streak',
  TOTAL_PUZZLES_COMPLETED = 'total_puzzles_completed',
  FIRST_PUZZLE = 'first_puzzle',
  DAILY_LOGIN = 'daily_login',
}

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 500, name: 'icon_url' })
  iconUrl: string;

  @Column({
    type: 'enum',
    enum: RuleType,
    name: 'rule_type',
  })
  ruleType: RuleType;

  @Column({ type: 'json', name: 'rule_value' })
  ruleValue: any; // Flexible JSON field for different rule configurations

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
