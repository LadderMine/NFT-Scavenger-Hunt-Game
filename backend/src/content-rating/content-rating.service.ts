import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentRating } from './entities/content-rating.entity';

@Injectable()
export class ContentRatingService {
  constructor(
    @InjectRepository(ContentRating)
    private readonly ratingRepo: Repository<ContentRating>,
  ) {}

  async rateContent(userId: string, contentId: string, rating: number) {
    try {
      const newRating = this.ratingRepo.create({ userId, contentId, rating });
      return await this.ratingRepo.save(newRating);
    } catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        throw new ConflictException('User has already rated this content.');
      }
      throw error;
    }
  }

  async getContentRatingStats(contentId: string) {
    const { avg, count } = await this.ratingRepo
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'avg')
      .addSelect('COUNT(rating.id)', 'count')
      .where('rating.contentId = :contentId', { contentId })
      .getRawOne();

    return {
      contentId,
      averageRating: parseFloat(avg) || 0,
      totalRatings: parseInt(count) || 0,
    };
  }
}
