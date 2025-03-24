import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class StoryChapter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  order: number;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isCompleted: boolean;

  @Column('text', { nullable: true })
  narrative: string;

  @Column('json', { default: [] })
  puzzles: Record<string, any>[];

  @Column('json', { default: {} })
  requirements: Record<string, any>;

  @Column('json', { default: [] })
  rewards: Record<string, any>[];

  @Column({ nullable: true })
  previousChapterId: string;

  @ManyToOne(() => StoryChapter, { nullable: true })
  previousChapter: StoryChapter;

  @Column({ nullable: true })
  nextChapterId: string;

  @ManyToOne(() => StoryChapter, { nullable: true })
  nextChapter: StoryChapter;

  @Column({ default: 0 })
  difficultyLevel: number;

  @Column({ default: false })
  isFinalChapter: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
