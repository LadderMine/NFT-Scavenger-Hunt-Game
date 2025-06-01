import { User } from "src/users/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Index, JoinColumn } from "typeorm";


export enum InAppNotificationType {
  GENERAL = 'GENERAL',
  ACHIEVEMENT = 'ACHIEVEMENT',
  REWARD = 'REWARD',
  SYSTEM = 'SYSTEM',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  WELCOME = 'WELCOME',
  CHALLENGE = 'CHALLENGE',
  NFT = 'NFT',
  LEADERBOARD = 'LEADERBOARD',
  FRIEND = 'FRIEND',
  GAME = 'GAME'
}

@Entity('in_app_notifications')
@Index(['userId', 'isRead'])
@Index(['userId', 'createdAt'])
export class InAppNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  title: string;

  @Column({ nullable: true })
  message?: string;

  @Column({ nullable: true })
  url?: string;

  @Column({
    type: 'enum',
    enum: InAppNotificationType,
    default: InAppNotificationType.GENERAL,
  })
  type: InAppNotificationType;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ default: false })
  @Index()
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date;

  @Column({ default: false })
  isArchived: boolean;

  @Column({ type: 'timestamp', nullable: true })
  archivedAt?: Date;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}
