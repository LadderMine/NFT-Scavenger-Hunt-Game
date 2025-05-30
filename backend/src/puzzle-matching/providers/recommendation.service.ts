import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, MoreThan } from 'typeorm';
import { Puzzles } from '../../puzzles/puzzles.entity';
import { UserSkillProfile } from '../entities/user-skill-profile.entity';
import { UserSkillProfileService } from './user-skill-profile.service';
import { LevelEnum } from '../../enums/LevelEnum';
import { Scores } from '../../scores/scores.entity';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Puzzles)
    private readonly puzzlesRepository: Repository<Puzzles>,
    @InjectRepository(Scores)
    private readonly scoresRepository: Repository<Scores>,
    private readonly userSkillProfileService: UserSkillProfileService,
  ) {}

  /**
   * Get puzzle recommendations for a user based on their skill profile
   */
  async getRecommendations(userId: number, count: number = 5): Promise<Puzzles[]> {
    // Get or update the user's skill profile
    const profile = await this.userSkillProfileService.updateUserSkillProfile(userId);
    
    // Determine the appropriate difficulty level based on the user's skill profile
    const recommendedLevel = this.determineRecommendedLevel(profile);
    
    // Find puzzles the user hasn't completed yet
    const completedPuzzleIds = await this.getCompletedPuzzleIds(userId);
    
    // Query for puzzles with the recommended difficulty level that the user hasn't completed
    const puzzles = await this.puzzlesRepository.find({
      where: {
        levelEnum: recommendedLevel,
        ...(completedPuzzleIds.length > 0 && { id: Not(In(completedPuzzleIds)) }), // Not in completed puzzles
      },
      take: count,
    });
    
    // If we don't have enough puzzles, get puzzles from adjacent difficulty levels
    if (puzzles.length < count) {
      const additionalPuzzles = await this.getAdditionalRecommendations(
        userId,
        recommendedLevel,
        completedPuzzleIds,
        count - puzzles.length
      );
      
      puzzles.push(...additionalPuzzles);
    }
    
    // Update the user's profile with the recommended level
    profile.lastRecommendedLevel = recommendedLevel;
    await this.userSkillProfileService.updateUserSkillProfile(userId);
    
    return puzzles;
  }
  
  /**
   * Determine the recommended difficulty level based on the user's skill profile
   */
  private determineRecommendedLevel(profile: UserSkillProfile): LevelEnum {
    const { skillScore, completionRate } = profile;
    
    // Determine level based on skill score and completion rate
    if (skillScore < 30) {
      return LevelEnum.EASY;
    } else if (skillScore < 60) {
      return LevelEnum.MEDIUM;
    } else if (skillScore < 85) {
      return LevelEnum.DIFFICULT;
    } else {
      return LevelEnum.ADVANCED;
    }
  }
  
  /**
   * Get IDs of puzzles the user has already completed
   */
  private async getCompletedPuzzleIds(userId: number): Promise<number[]> {
    const scores = await this.scoresRepository.find({
      where: { user: { id: userId }, score: MoreThan(0) },
      relations: ['puzzle'],
    });
    
    return scores.map(score => score.puzzle?.id).filter(id => id !== undefined);
  }
  
  /**
   * Get additional puzzle recommendations from adjacent difficulty levels
   */
  private async getAdditionalRecommendations(
    userId: number,
    currentLevel: LevelEnum,
    completedPuzzleIds: number[],
    count: number
  ): Promise<Puzzles[]> {
    // Determine adjacent difficulty levels
    const adjacentLevels = this.getAdjacentLevels(currentLevel);
    
    // Query for puzzles from adjacent levels
    const additionalPuzzles = [];
    
    for (const level of adjacentLevels) {
      if (additionalPuzzles.length >= count) break;
      
      const puzzles = await this.puzzlesRepository.find({
        where: {
          levelEnum: level,
          ...(completedPuzzleIds.length > 0 && { id: Not(In(completedPuzzleIds)) }),
        },
        take: count - additionalPuzzles.length,
      });
      
      additionalPuzzles.push(...puzzles);
    }
    
    return additionalPuzzles;
  }
  
  /**
   * Get adjacent difficulty levels in order of preference
   */
  private getAdjacentLevels(currentLevel: LevelEnum): LevelEnum[] {
    switch (currentLevel) {
      case LevelEnum.EASY:
        return [LevelEnum.MEDIUM, LevelEnum.DIFFICULT];
      case LevelEnum.MEDIUM:
        return [LevelEnum.EASY, LevelEnum.DIFFICULT, LevelEnum.ADVANCED];
      case LevelEnum.DIFFICULT:
        return [LevelEnum.MEDIUM, LevelEnum.ADVANCED, LevelEnum.EASY];
      case LevelEnum.ADVANCED:
        return [LevelEnum.DIFFICULT, LevelEnum.MEDIUM, LevelEnum.EASY];
      default:
        return [LevelEnum.EASY, LevelEnum.MEDIUM, LevelEnum.DIFFICULT, LevelEnum.ADVANCED];
    }
  }
}
