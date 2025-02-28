import { Controller, Post, Delete, Get, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { FollowService } from './socials.service';
import { FollowDto, FollowResponseDto, UserDto, ActivityDto, PaginationDto } from './dto/socials.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('social')
export class SocialController {
  constructor(private readonly followService: FollowService) {}

  @Post('follow')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async followUser(
    @Request() req,
    @Body() followDto: FollowDto,
  ): Promise<FollowResponseDto> {
    return this.followService.followUser(req.user.id, followDto);
  }

  @Delete('follow/:id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async unfollowUser(
    @Request() req,
    @Param('id') followingId: string,
  ): Promise<void> {
    return this.followService.unfollowUser(req.user.id, followingId);
  }

  @Get('followers/:userId')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getFollowers(
    @Request() req,
    @Param('userId') userId: string,
  ): Promise<UserDto[]> {
    return this.followService.getFollowers(userId, req.user?.id);
  }

  @Get('following/:userId')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getFollowing(
    @Request() req,
    @Param('userId') userId: string,
  ): Promise<UserDto[]> {
    return this.followService.getFollowing(userId, req.user?.id);
  }

  @Get('recommended')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getRecommendedUsers(
    @Request() req,
    @Query('limit') limit: number,
  ): Promise<UserDto[]> {
    return this.followService.getRecommendedUsers(req.user.id, limit || 10);
  }

  @Get('feed')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getActivityFeed(
    @Request() req,
    @Query() paginationDto: PaginationDto,
  ): Promise<ActivityDto[]> {
    return this.followService.getActivityFeed(req.user.id, paginationDto);
  }

  // Bonus endpoint to create activities (e.g., posts, comments)
  @Post('activity')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
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
