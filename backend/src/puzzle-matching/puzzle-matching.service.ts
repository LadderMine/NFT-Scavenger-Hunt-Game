import { Injectable } from '@nestjs/common';
import { UserSkillProfileService } from './providers/user-skill-profile.service';
import { RecommendationService } from './providers/recommendation.service';
import { Puzzles } from '../puzzles/puzzles.entity';
import { UserSkillProfile } from './entities/user-skill-profile.entity';

@Injectable()
export class PuzzleMatchingService {
  constructor(
    private readonly userSkillProfileService: UserSkillProfileService,
    private readonly recommendationService: RecommendationService,
  ) {}

  /**
   * Get puzzle recommendations for a user
   */
  async getRecommendedPuzzles(userId: number, count: number = 5): Promise<Puzzles[]> {
    return this.recommendationService.getRecommendations(userId, count);
  }

  /**
   * Get a user's skill profile
   */
  async getUserSkillProfile(userId: number): Promise<UserSkillProfile> {
    return this.userSkillProfileService.getUserSkillProfile(userId);
  }

  /**
   * Update a user's skill profile based on recent activity
   */
  async updateUserSkillProfile(userId: number): Promise<UserSkillProfile> {
    return this.userSkillProfileService.updateUserSkillProfile(userId);
  }
}
