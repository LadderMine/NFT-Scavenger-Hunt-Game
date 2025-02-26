import { User } from 'src/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Leaderboard {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.leaderboardEntries, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  username: string;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({ type: 'int', default: 0 })
  total_points: number;

  @Column({ type: 'int', default: 0 })
  nfts_collected: number;

  @Column({ type: 'int', default: 0 })
  challenges_completed: number;

  @Column({ type: 'int', default: 0 })
  rank: number;

  @CreateDateColumn()
  last_updated: Date;
}
