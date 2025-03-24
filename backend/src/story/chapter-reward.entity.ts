import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StoryChapter } from './story-chapter.entity';

export enum RewardType {
  NFT = 'nft',
  BADGE = 'badge',
  POINTS = 'points',
  UNLOCK_CHAPTER = 'unlock_chapter',
}

@Entity()
export class ChapterReward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RewardType,
  })
  type: RewardType;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('json')
  data: Record<string, any>;

  @ManyToOne(() => StoryChapter, (chapter) => chapter.rewards)
  chapter: StoryChapter;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
