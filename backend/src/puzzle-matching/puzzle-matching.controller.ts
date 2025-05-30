import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PuzzleMatchingService } from './puzzle-matching.service';
import { RecommendationRequestDto } from './dto/recommendation-request.dto';
import { SkillProfileResponseDto } from './dto/skill-profile-response.dto';
import { AuthTokenGuard } from '../auth/guard/auth-token/auth-token.guard';

@ApiTags('Puzzle Matching')
@Controller('puzzle-matching')
@UseGuards(AuthTokenGuard)
@ApiBearerAuth()
export class PuzzleMatchingController {
  constructor(private readonly puzzleMatchingService: PuzzleMatchingService) {}

  @Post('recommendations')
  @ApiOperation({ summary: 'Get puzzle recommendations for a user' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of recommended puzzles based on user skill level',
  })
  async getRecommendations(@Body() requestDto: RecommendationRequestDto) {
    const { userId, count } = requestDto;
    const recommendations = await this.puzzleMatchingService.getRecommendedPuzzles(userId, count);
    return { recommendations };
  }

  @Get('skill-profile/:userId')
  @ApiOperation({ summary: 'Get a user\'s skill profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user\'s skill profile',
    type: SkillProfileResponseDto,
  })
  async getUserSkillProfile(@Param('userId') userId: number) {
    const profile = await this.puzzleMatchingService.getUserSkillProfile(userId);
    return profile;
  }

  @Post('skill-profile/:userId/update')
  @ApiOperation({ summary: 'Update a user\'s skill profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated user\'s skill profile',
    type: SkillProfileResponseDto,
  })
  async updateUserSkillProfile(@Param('userId') userId: number) {
    const profile = await this.puzzleMatchingService.updateUserSkillProfile(userId);
    return profile;
  }

  @Get('smart-recommendations')
  @ApiOperation({ summary: 'Get smart puzzle recommendations for a user' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of recommended puzzles based on user skill level, history, and completion rate',
  })
  async getSmartRecommendations(
    @Query('userId') userId: number,
    @Query('count') count: number = 5,
  ) {
    // First update the user's skill profile to ensure recommendations are based on latest data
    await this.puzzleMatchingService.updateUserSkillProfile(userId);
    
    // Then get recommendations
    const recommendations = await this.puzzleMatchingService.getRecommendedPuzzles(userId, count);
    
    return { recommendations };
  }
}
