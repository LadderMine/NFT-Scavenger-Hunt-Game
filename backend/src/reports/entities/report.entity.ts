import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['puzzleId', 'userId']) // Prevent duplicate reports
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  puzzleId: number;

  @Column()
  userId: number;

  @Column()
  message: string;

  @Column({ default: false })
  resolved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
