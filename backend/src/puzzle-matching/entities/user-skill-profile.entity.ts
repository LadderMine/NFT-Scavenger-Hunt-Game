import { User } from 'src/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_skill_profiles')
export class UserSkillProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'int', default: 0 })
  userId: number;

  // Overall skill score (0-100)
  @Column({ type: 'float', default: 50 })
  skillScore: number;

  // Completion rate (0-100%)
  @Column({ type: 'float', default: 0 })
  completionRate: number;

  // Average time to solve puzzles (in seconds)
  @Column({ type: 'float', default: 0 })
  averageSolveTime: number;

  // Number of puzzles attempted
  @Column({ type: 'int', default: 0 })
  puzzlesAttempted: number;

  // Number of puzzles completed
  @Column({ type: 'int', default: 0 })
  puzzlesCompleted: number;

  // Skill level for each difficulty
  @Column({ type: 'float', default: 0 })
  easySkillScore: number;

  @Column({ type: 'float', default: 0 })
  mediumSkillScore: number;

  @Column({ type: 'float', default: 0 })
  difficultSkillScore: number;

  @Column({ type: 'float', default: 0 })
  advancedSkillScore: number;

  // Last difficulty level recommended
  @Column({ type: 'varchar', nullable: true })
  lastRecommendedLevel: string;

  // Timestamp when the profile was last updated
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
