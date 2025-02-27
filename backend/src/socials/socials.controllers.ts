import { Controller, Post, Delete, Get, Body, Param, Query, Request } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowDto, FollowResponseDto, UserDto, ActivityDto, PaginationDto } from './dto/socials.dto';

@Controller('social')
export class SocialController {
  constructor(private readonly followService: FollowService) {}

  @Post('follow')
  async followUser(
    @Request() req,
    @Body() followDto: FollowDto,
  ): Promise<FollowResponseDto> {
    return this.followService.followUser(req.user.id, followDto);
  }

  @Delete('follow/:id')
  async unfollowUser(
    @Request() req,
    @Param('id') followingId: string,
  ): Promise<void> {
    return this.followService.unfollowUser(req.user.id, followingId);
  }

  @Get('followers/:userId')
  async getFollowers(
    @Request() req,
    @Param('userId') userId: string,
  ): Promise<UserDto[]> {
    return this.followService.getFollowers(userId, req.user?.id);
  }

  @Get('following/:userId')
  async getFollowing(
    @Request() req,
    @Param('userId') userId: string,
  ): Promise<UserDto[]> {
    return this.followService.getFollowing(userId, req.user?.id);
  }

  @Get('recommended')
  async getRecommendedUsers(
    @Request() req,
    @Query('limit') limit: number,
  ): Promise<UserDto[]> {
    return this.followService.getRecommendedUsers(req.user.id, limit || 10);
  }

  @Get('feed')
  async getActivityFeed(
    @Request() req,
    @Query() paginationDto: PaginationDto,
  ): Promise<ActivityDto[]> {
    return this.followService.getActivityFeed(req.user.id, paginationDto);
  }

  // Bonus endpoint to create activities (e.g., posts, comments)
  @Post('activity')
  async createActivity(
    @Request() req,
    @Body() activityData: { type: string; data: any },
  ): Promise<ActivityDto> {
    return this.followService.createActivity(
      req.user.id,
      activityData.type,
      activityData.data,
    );
  }
}
