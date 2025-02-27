import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { StoryChapter } from './story-chapter.entity';
import { plainToClass } from 'class-transformer';
import { ChapterResponseDto } from './dto/chapter-response.dto';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryChapter)
    private chapterRepository: Repository<StoryChapter>,
  ) {}

  async findAllChapters(userId?: string): Promise<ChapterResponseDto[]> {
    // Get all active chapters
    const chapters = await this.chapterRepository.find({
      where: { isActive: true },
      order: { order: 'ASC' },
      relations: ['previousChapter', 'nextChapter'],
    });

    // If userId is provided, we could fetch user progress and mark completed chapters
    // This would require integration with a user progress service
    // For now, we'll just return the chapters as is

    return chapters.map((chapter) =>
      plainToClass(ChapterResponseDto, chapter, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findChapterById(
    chapterId: string,
    userId?: string,
  ): Promise<ChapterResponseDto> {
    const chapter = await this.chapterRepository.findOne({
      where: { id: chapterId },
      relations: ['previousChapter', 'nextChapter'],
    });

    if (!chapter) {
      throw new NotFoundException(
        `Story chapter with ID ${chapterId} not found`,
      );
    }

    // If userId is provided, we could check if the user has access to this chapter
    // and include user-specific progress information
    // For now, we'll just return the chapter as is

    return plainToClass(ChapterResponseDto, chapter, {
      excludeExtraneousValues: true,
    });
  }

  // Additional methods that could be implemented:
  // - checkChapterAccess(userId, chapterId) - Check if a user has access to a chapter
  // - getNextAvailableChapter(userId) - Get the next chapter a user can access
  // - markChapterAsCompleted(userId, chapterId) - Mark a chapter as completed for a user
}
