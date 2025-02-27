import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StoryChapter } from './story-chapter.entity';

export enum RequirementType {
  NFT_COLLECTION = 'nft_collection',
  SPECIFIC_NFT = 'specific_nft',
  LOCATION = 'location',
  TASK = 'task',
  QUIZ = 'quiz',
}

@Entity()
export class ChapterRequirement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RequirementType,
  })
  type: RequirementType;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('json')
  data: Record<string, any>;

  @ManyToOne(() => StoryChapter, (chapter) => chapter.requirements)
  chapter: StoryChapter;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
