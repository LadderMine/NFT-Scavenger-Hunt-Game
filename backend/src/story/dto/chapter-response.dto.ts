import { Exclude, Expose, Transform } from 'class-transformer';

export class ChapterResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  order: number;

  @Expose()
  description: string;

  @Expose()
  imageUrl: string;

  @Expose()
  isActive: boolean;

  @Expose()
  isCompleted: boolean;

  @Expose()
  narrative: string;

  @Expose()
  puzzles: Record<string, any>[];

  @Expose()
  difficultyLevel: number;

  @Expose()
  isFinalChapter: boolean;

  @Expose()
  @Transform(({ obj }) => (obj.previousChapterId ? true : false))
  hasPreviousChapter: boolean;

  @Expose()
  @Transform(({ obj }) => (obj.nextChapterId ? true : false))
  hasNextChapter: boolean;

  @Expose()
  rewards: Record<string, any>[];

  @Exclude()
  requirements: Record<string, any>;

  @Exclude()
  previousChapterId: string;

  @Exclude()
  previousChapter: any;

  @Exclude()
  nextChapterId: string;

  @Exclude()
  nextChapter: any;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
