import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Achievement } from './achievement.entity';

@Entity('player_achievements')
export class PlayerAchievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'player_id' })
  playerId: string;

  @Column({ type: 'uuid', name: 'achievement_id' })
  achievementId: string;

  @CreateDateColumn({ name: 'earned_at' })
  earnedAt: Date;

  @ManyToOne(() => Achievement)
  @JoinColumn({ name: 'achievement_id' })
  achievement: Achievement;
}
