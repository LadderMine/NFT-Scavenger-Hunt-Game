import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSkillProfile } from '../entities/user-skill-profile.entity';
import { User } from '../../users/users.entity';
import { Scores } from '../../scores/scores.entity';
import { LevelEnum } from '../../enums/LevelEnum';

@Injectable()
export class UserSkillProfileService {
  constructor(
    @InjectRepository(UserSkillProfile)
    private readonly userSkillProfileRepository: Repository<UserSkillProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Scores)
    private readonly scoresRepository: Repository<Scores>,
  ) {}

  /**
   * Get a user's skill profile, creating one if it doesn't exist
   */
  async getUserSkillProfile(userId: number): Promise<UserSkillProfile> {
    let profile = await this.userSkillProfileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!profile) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      profile = this.userSkillProfileRepository.create({
        user,
        userId,
        skillScore: 50, // Default starting score
      });

      await this.userSkillProfileRepository.save(profile);
    }

    return profile;
  }

  /**
   * Update a user's skill profile based on their recent activity
   */
  async updateUserSkillProfile(userId: number): Promise<UserSkillProfile> {
    const profile = await this.getUserSkillProfile(userId);
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['scores'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get all scores for this user
    const scores = await this.scoresRepository.find({
      where: { user: { id: userId } },
      relations: ['puzzle'],
    });

    // Calculate metrics
    const puzzlesAttempted = scores.length;
    const puzzlesCompleted = scores.filter(score => score.score > 0).length;
    const completionRate = puzzlesAttempted > 0 ? (puzzlesCompleted / puzzlesAttempted) * 100 : 0;

    // Calculate skill scores for each difficulty level
    const easyScores = scores.filter(score => score.puzzle?.levelEnum === LevelEnum.EASY);
    const mediumScores = scores.filter(score => score.puzzle?.levelEnum === LevelEnum.MEDIUM);
    const difficultScores = scores.filter(score => score.puzzle?.levelEnum === LevelEnum.DIFFICULT);
    const advancedScores = scores.filter(score => score.puzzle?.levelEnum === LevelEnum.ADVANCED);

    // Calculate average scores for each difficulty level
    const easySkillScore = this.calculateAverageScore(easyScores);
    const mediumSkillScore = this.calculateAverageScore(mediumScores);
    const difficultSkillScore = this.calculateAverageScore(difficultScores);
    const advancedSkillScore = this.calculateAverageScore(advancedScores);

    // Calculate overall skill score (weighted average of difficulty levels)
    const overallSkillScore = this.calculateOverallSkillScore(
      easySkillScore,
      mediumSkillScore,
      difficultSkillScore,
      advancedSkillScore,
      completionRate
    );

    // Update the profile
    profile.skillScore = overallSkillScore;
    profile.completionRate = completionRate;
    profile.puzzlesAttempted = puzzlesAttempted;
    profile.puzzlesCompleted = puzzlesCompleted;
    profile.easySkillScore = easySkillScore;
    profile.mediumSkillScore = mediumSkillScore;
    profile.difficultSkillScore = difficultSkillScore;
    profile.advancedSkillScore = advancedSkillScore;

    return this.userSkillProfileRepository.save(profile);
  }

  /**
   * Calculate the average score for a given array of scores
   */
  private calculateAverageScore(scores: Scores[]): number {
    if (scores.length === 0) return 0;
    const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
    return totalScore / scores.length;
  }

  /**
   * Calculate the overall skill score based on performance across difficulty levels
   */
  private calculateOverallSkillScore(
    easyScore: number,
    mediumScore: number,
    difficultScore: number,
    advancedScore: number,
    completionRate: number
  ): number {
    // Weights for each difficulty level
    const easyWeight = 0.1;
    const mediumWeight = 0.2;
    const difficultWeight = 0.3;
    const advancedWeight = 0.4;

    // Calculate weighted score
    let weightedScore = 0;
    let totalWeight = 0;

    if (easyScore > 0) {
      weightedScore += easyScore * easyWeight;
      totalWeight += easyWeight;
    }

    if (mediumScore > 0) {
      weightedScore += mediumScore * mediumWeight;
      totalWeight += mediumWeight;
    }

    if (difficultScore > 0) {
      weightedScore += difficultScore * difficultWeight;
      totalWeight += difficultWeight;
    }

    if (advancedScore > 0) {
      weightedScore += advancedScore * advancedWeight;
      totalWeight += advancedWeight;
    }

    // If no scores yet, return default score
    if (totalWeight === 0) return 50;

    // Normalize the score
    const normalizedScore = weightedScore / totalWeight;

    // Factor in completion rate (higher completion rate = higher skill score)
    return normalizedScore * (0.7 + (completionRate / 100) * 0.3);
  }
}
