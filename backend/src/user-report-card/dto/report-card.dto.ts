import { IsString, IsNumber, IsOptional, IsArray, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReportCardDto {
  @ApiProperty({ description: 'Unique identifier for the report card' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'User ID associated with this report card' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Number of puzzles completed by the user' })
  @IsNumber()
  completedPuzzles: number;

  @ApiProperty({ description: 'Number of NFT rewards earned' })
  @IsNumber()
  rewardsEarned: number;

  @ApiProperty({ description: 'Overall progress percentage (0-100)' })
  @IsNumber()
  progressPercentage: number;

  @ApiProperty({ description: 'Total time spent in minutes' })
  @IsNumber()
  totalTimeSpent: number;

  @ApiProperty({ description: 'Current streak in days' })
  @IsNumber()
  streakDays: number;

  @ApiProperty({ 
    description: 'Breakdown by puzzle category',
    example: { beginner: 5, intermediate: 3, advanced: 1 }
  })
  @IsOptional()
  @IsObject()
  categoryBreakdown?: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };

  @ApiProperty({ 
    description: 'Recent achievements',
    example: ['First NFT Earned', 'Speed Solver', '7-Day Streak']
  })
  @IsOptional()
  @IsArray()
  recentAchievements?: string[];

  @ApiProperty({ description: 'Report card creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Report card last update date' })
  updatedAt: Date;
}

export class CreateReportCardDto {
  @ApiProperty({ description: 'User ID for the report card' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Number of completed puzzles', required: false })
  @IsOptional()
  @IsNumber()
  completedPuzzles?: number;

  @ApiProperty({ description: 'Number of rewards earned', required: false })
  @IsOptional()
  @IsNumber()
  rewardsEarned?: number;
}