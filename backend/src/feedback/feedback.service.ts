import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import type { Repository } from 'typeorm';
import type { Feedback } from './entities/feedback.entity';
import type { CreateFeedbackDto } from './dto/create-feedback.dto';
import type {
  FeedbackResponseDto,
  FeedbackStatsDto,
} from './dto/feedback-response.dto';

@Injectable()
export class FeedbackService {
  constructor(private feedbackRepository: Repository<Feedback>) {}

  async createFeedback(
    createFeedbackDto: CreateFeedbackDto,
  ): Promise<FeedbackResponseDto> {
    // Check if user already provided feedback for this challenge
    const existingFeedback = await this.feedbackRepository.findOne({
      where: {
        userId: createFeedbackDto.userId,
        challengeId: createFeedbackDto.challengeId,
      },
    });

    if (existingFeedback) {
      throw new ConflictException(
        'User has already provided feedback for this challenge',
      );
    }

    // Validate meaningful response
    if (this.isGenericComment(createFeedbackDto.comment)) {
      throw new BadRequestException(
        'Please provide more specific and meaningful feedback',
      );
    }

    const feedback = this.feedbackRepository.create(createFeedbackDto);
    const savedFeedback = await this.feedbackRepository.save(feedback);

    return this.mapToResponseDto(savedFeedback);
  }

  async getFeedbackByChallenge(
    challengeId: string,
  ): Promise<FeedbackResponseDto[]> {
    const feedbacks = await this.feedbackRepository.find({
      where: { challengeId },
      order: { timestamp: 'DESC' },
    });

    return feedbacks.map((feedback) => this.mapToResponseDto(feedback));
  }

  async getFeedbackStats(challengeId: string): Promise<FeedbackStatsDto> {
    const feedbacks = await this.feedbackRepository.find({
      where: { challengeId },
    });

    if (feedbacks.length === 0) {
      return {
        averageRating: 0,
        totalFeedbacks: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalRating = feedbacks.reduce(
      (sum, feedback) => sum + feedback.rating,
      0,
    );
    const averageRating =
      Math.round((totalRating / feedbacks.length) * 10) / 10;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach((feedback) => {
      ratingDistribution[feedback.rating]++;
    });

    return {
      averageRating,
      totalFeedbacks: feedbacks.length,
      ratingDistribution,
    };
  }

  async getUserFeedback(userId: string): Promise<FeedbackResponseDto[]> {
    const feedbacks = await this.feedbackRepository.find({
      where: { userId },
      order: { timestamp: 'DESC' },
    });

    return feedbacks.map((feedback) => this.mapToResponseDto(feedback));
  }

  private mapToResponseDto(feedback: Feedback): FeedbackResponseDto {
    return {
      id: feedback.id,
      userId: feedback.userId,
      challengeId: feedback.challengeId,
      rating: feedback.rating,
      comment: feedback.comment,
      timestamp: feedback.timestamp,
    };
  }

  private isGenericComment(comment: string): boolean {
    const genericPhrases = [
      'good',
      'bad',
      'ok',
      'fine',
      'nice',
      'great',
      'terrible',
      'awesome',
    ];

    const normalizedComment = comment.toLowerCase().trim();

    // Check if comment is too short or just generic words
    if (normalizedComment.length < 15) {
      return true;
    }

    // Check if comment contains only generic phrases
    const words = normalizedComment.split(/\s+/);
    const meaningfulWords = words.filter(
      (word) => word.length > 3 && !genericPhrases.includes(word),
    );

    return meaningfulWords.length < 3;
  }
}
