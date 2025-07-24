import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
  ManyToOne,
  Index,
} from 'typeorm';

@Entity('content_ratings')
@Unique(['userId', 'contentId']) // Enforces one rating per user per content
export class ContentRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column()
  @Index()
  contentId: string;

  @Column('int')
  rating: number; // Typically from 1 to 5

  @CreateDateColumn()
  createdAt: Date;
}
