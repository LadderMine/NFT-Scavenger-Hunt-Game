import { User } from 'src/users/users.entity';
import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

export class Rank {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.id, { eager: true, cascade: true })
  @JoinColumn({ name: 'userId' })
  userId: User;

  @Column()
  rank: number;

  @Column({ default: 0 })
  totalPoints: number;
}
