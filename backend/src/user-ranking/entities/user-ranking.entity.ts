import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class UserRank {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true })
  userId: string;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  achievements: number;

  @Column({ default: 0 })
  activityPoints: number;

  @Column({ default: 0 })
  rank: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;
}
