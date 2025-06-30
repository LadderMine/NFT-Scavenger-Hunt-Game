import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportCard } from './entities/user-report-card.entity';
import { ReportCardDto, CreateReportCardDto } from './dto/report-card.dto';

@Injectable()
export class UserReportCardService {
  // Mock data storage (in a real app, this would be a database)
  private reportCards: Map<string, ReportCard> = new Map();
  private mockUsers = ['user1', 'user2', 'user3', 'user4', 'user5'];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Generate mock report cards for demonstration
    this.mockUsers.forEach((userId, index) => {
      const reportCard = new ReportCard();
      reportCard.id = `report-${index + 1}`;
      reportCard.userId = userId;
      reportCard.completedPuzzles = Math.floor(Math.random() * 20) + 1;
      reportCard.rewardsEarned = Math.floor(Math.random() * 10) + 1;
      reportCard.totalTimeSpent = Math.floor(Math.random() * 300) + 30;
      reportCard.streakDays = Math.floor(Math.random() * 15);
      reportCard.categoryBreakdown = {
        beginner: Math.floor(Math.random() * 8) + 1,
        intermediate: Math.floor(Math.random() * 6),
        advanced: Math.floor(Math.random() * 3),
      };
      reportCard.recentAchievements = this.generateRandomAchievements();
      reportCard.createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      reportCard.updatedAt = new Date();

      // Calculate progress percentage based on completed puzzles
      reportCard.progressPercentage = this.calculateProgress(reportCard);

      this.reportCards.set(userId, reportCard);
    });
  }

  private generateRandomAchievements(): string[] {
    const possibleAchievements = [
      'First NFT Earned',
      'Speed Solver',
      '7-Day Streak',
      'StarkNet Explorer',
      'Puzzle Master',
      'Early Bird',
      'Night Owl',
      'Perfect Score',
      'Team Player',
      'Knowledge Seeker'
    ];
    
    const count = Math.floor(Math.random() * 4) + 1;
    return possibleAchievements
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
  }

  private calculateProgress(reportCard: ReportCard): number {
    // Mock calculation based on completed puzzles and rewards
    const totalPossiblePuzzles = 50; // Assuming 50 total puzzles in the game
    const puzzleWeight = 0.7;
    const rewardWeight = 0.3;
    
    const puzzleProgress = (reportCard.completedPuzzles / totalPossiblePuzzles) * 100;
    const rewardProgress = (reportCard.rewardsEarned / (totalPossiblePuzzles * 0.5)) * 100;
    
    const totalProgress = (puzzleProgress * puzzleWeight) + (rewardProgress * rewardWeight);
    return Math.min(Math.round(totalProgress * 100) / 100, 100);
  }

  async findByUserId(userId: string): Promise<ReportCardDto> {
    const reportCard = this.reportCards.get(userId);
    
    if (!reportCard) {
      throw new NotFoundException(`Report card for user ${userId} not found`);
    }

    return this.mapToDto(reportCard);
  }

  async createReportCard(createDto: CreateReportCardDto): Promise<ReportCardDto> {
    const existingCard = this.reportCards.get(createDto.userId);
    if (existingCard) {
      return this.mapToDto(existingCard);
    }

    const reportCard = new ReportCard();
    reportCard.id = `report-${Date.now()}`;
    reportCard.userId = createDto.userId;
    reportCard.completedPuzzles = createDto.completedPuzzles || 0;
    reportCard.rewardsEarned = createDto.rewardsEarned || 0;
    reportCard.totalTimeSpent = 0;
    reportCard.streakDays = 0;
    reportCard.categoryBreakdown = { beginner: 0, intermediate: 0, advanced: 0 };
    reportCard.recentAchievements = [];
    reportCard.createdAt = new Date();
    reportCard.updatedAt = new Date();
    reportCard.progressPercentage = this.calculateProgress(reportCard);

    this.reportCards.set(createDto.userId, reportCard);
    return this.mapToDto(reportCard);
  }

  async updateProgress(userId: string, puzzlesCompleted?: number, rewardsEarned?: number): Promise<ReportCardDto> {
    const reportCard = this.reportCards.get(userId);
    
    if (!reportCard) {
      throw new NotFoundException(`Report card for user ${userId} not found`);
    }

    if (puzzlesCompleted !== undefined) {
      reportCard.completedPuzzles = puzzlesCompleted;
    }
    
    if (rewardsEarned !== undefined) {
      reportCard.rewardsEarned = rewardsEarned;
    }

    reportCard.progressPercentage = this.calculateProgress(reportCard);
    reportCard.updatedAt = new Date();

    this.reportCards.set(userId, reportCard);
    return this.mapToDto(reportCard);
  }

  async getAllReportCards(): Promise<ReportCardDto[]> {
    return Array.from(this.reportCards.values()).map(card => this.mapToDto(card));
  }

  private mapToDto(reportCard: ReportCard): ReportCardDto {
    const dto = new ReportCardDto();
    dto.id = reportCard.id;
    dto.userId = reportCard.userId;
    dto.completedPuzzles = reportCard.completedPuzzles;
    dto.rewardsEarned = reportCard.rewardsEarned;
    dto.progressPercentage = reportCard.progressPercentage;
    dto.totalTimeSpent = reportCard.totalTimeSpent;
    dto.streakDays = reportCard.streakDays;
    dto.categoryBreakdown = reportCard.categoryBreakdown;
    dto.recentAchievements = reportCard.recentAchievements;
    dto.createdAt = reportCard.createdAt;
    dto.updatedAt = reportCard.updatedAt;
    return dto;
  }
}