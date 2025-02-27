import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { Activity } from './entities/activity.entity';
import { User } from '../users/user.entity';
import { FollowDto, FollowResponseDto, UserDto, ActivityDto, PaginationDto } from './dto/socials.dto';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async followUser(userId: string, followDto: FollowDto): Promise<FollowResponseDto> {
    if (userId === followDto.followingId) {
      throw new ConflictException('You cannot follow yourself');
    }

    // Check if users exist
    const follower = await this.userRepository.findOne({ where: { id: userId } });
    const following = await this.userRepository.findOne({ where: { id: followDto.followingId } });
    
    if (!follower || !following) {
      throw new NotFoundException('User not found');
    }

    // Check if already following
    const existingFollow = await this.followRepository.findOne({
      where: { followerId: userId, followingId: followDto.followingId },
    });

    if (existingFollow) {
      throw new ConflictException('Already following this user');
    }

    // Create new follow relationship
    const newFollow = this.followRepository.create({
      followerId: userId,
      followingId: followDto.followingId,
    });

    await this.followRepository.save(newFollow);

    return {
      id: newFollow.id,
      followerId: newFollow.followerId,
      followingId: newFollow.followingId,
      createdAt: newFollow.createdAt,
    };
  }

  async unfollowUser(userId: string, followingId: string): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: { followerId: userId, followingId },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    await this.followRepository.remove(follow);
  }

  async getFollowers(userId: string, currentUserId?: string): Promise<UserDto[]> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get followers with raw query for better performance
    const query = `
      SELECT u.id, u.username, u.bio, u."profilePicture"
      FROM "user" u
      JOIN follow f ON u.id = f."followerId"
      WHERE f."followingId" = $1
    `;
    
    const followers = await this.userRepository.query(query, [userId]);
    
    // Get follow status and counts
    return Promise.all(followers.map(async (user) => {
      const followersCount = await this.followRepository.count({ where: { followingId: user.id } });
      const followingCount = await this.followRepository.count({ where: { followerId: user.id } });
      
      let isFollowing = false;
      if (currentUserId) {
        const followRelation = await this.followRepository.findOne({
          where: { followerId: currentUserId, followingId: user.id },
        });
        isFollowing = !!followRelation;
      }

      return {
        id: user.id,
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture,
        isFollowing,
        followersCount,
        followingCount,
      };
    }));
  }

  async getFollowing(userId: string, currentUserId?: string): Promise<UserDto[]> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get following with raw query for better performance
    const query = `
      SELECT u.id, u.username, u.bio, u."profilePicture"
      FROM "user" u
      JOIN follow f ON u.id = f."followingId"
      WHERE f."followerId" = $1
    `;
    
    const following = await this.userRepository.query(query, [userId]);
    
    // Get follow status and counts
    return Promise.all(following.map(async (user) => {
      const followersCount = await this.followRepository.count({ where: { followingId: user.id } });
      const followingCount = await this.followRepository.count({ where: { followerId: user.id } });
      
      let isFollowing = false;
      if (currentUserId) {
        const followRelation = await this.followRepository.findOne({
          where: { followerId: currentUserId, followingId: user.id },
        });
        isFollowing = !!followRelation;
      }

      return {
        id: user.id,
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture,
        isFollowing,
        followersCount,
        followingCount,
      };
    }));
  }

  async getRecommendedUsers(userId: string, limit: number = 10): Promise<UserDto[]> {
    // Find users that the current user's followings are following (mutual connections)
    const query = `
      WITH user_following AS (
        SELECT "followingId" FROM follow WHERE "followerId" = $1
      ),
      second_degree_connections AS (
        SELECT f."followingId", COUNT(f."followerId") as mutual_count
        FROM follow f
        WHERE f."followerId" IN (SELECT "followingId" FROM user_following)
        AND f."followingId" NOT IN (SELECT "followingId" FROM user_following)
        AND f."followingId" != $1
        GROUP BY f."followingId"
        ORDER BY mutual_count DESC
        LIMIT $2
      )
      SELECT u.id, u.username, u.bio, u."profilePicture", sdc.mutual_count
      FROM "user" u
      JOIN second_degree_connections sdc ON u.id = sdc."followingId"
      ORDER BY sdc.mutual_count DESC
    `;
    
    const recommendedUsers = await this.userRepository.query(query, [userId, limit]);
    
    // If not enough recommendations based on mutual connections, add users with most followers
    if (recommendedUsers.length < limit) {
      const additionalLimit = limit - recommendedUsers.length;
      const existingIds = recommendedUsers.map(u => u.id).concat([userId]);
      
      const popularQuery = `
        SELECT u.id, u.username, u.bio, u."profilePicture", COUNT(f."followerId") as followers_count
        FROM "user" u
        LEFT JOIN follow f ON u.id = f."followingId"
        WHERE u.id NOT IN (${existingIds.map((_, i) => `$${i + 1}`).join(',')})
        GROUP BY u.id
        ORDER BY followers_count DESC
        LIMIT $${existingIds.length + 1}
      `;
      
      const popularUsers = await this.userRepository.query(popularQuery, [...existingIds, additionalLimit]);
      recommendedUsers.push(...popularUsers);
    }
    
    // Transform to DTOs
    return Promise.all(recommendedUsers.map(async user => {
      const followersCount = await this.followRepository.count({ where: { followingId: user.id } });
      const followingCount = await this.followRepository.count({ where: { followerId: user.id } });
      
      return {
        id: user.id,
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followersCount,
        followingCount,
      };
    }));
  }

  async getActivityFeed(userId: string, pagination: PaginationDto): Promise<ActivityDto[]> {
    const { page, limit } = pagination;
    
    // Get IDs of users that the current user is following
    const following = await this.followRepository.find({
      where: { followerId: userId },
      select: ['followingId'],
    });
    
    const followingIds = following.map(f => f.followingId);
    
    // If not following anyone, return empty array
    if (followingIds.length === 0) {
      return [];
    }
    
    // Get activities from followed users
    const query = `
      SELECT a.id, a.type, a.data, a."createdAt", 
             u.id as "userId", u.username, u."profilePicture"
      FROM activity a
      JOIN "user" u ON a."userId" = u.id
      WHERE a."userId" IN (${followingIds.map((_, i) => `$${i + 1}`).join(',')})
      ORDER BY a."createdAt" DESC
      LIMIT $${followingIds.length + 1} OFFSET $${followingIds.length + 2}
    `;
    
    const offset = (page - 1) * limit;
    const activities = await this.activityRepository.query(query, [...followingIds, limit, offset]);
    
    // Transform to DTOs
    return activities.map(activity => ({
      id: activity.id,
      user: {
        id: activity.userId,
        username: activity.username,
        profilePicture: activity.profilePicture,
      },
      type: activity.type,
      data: activity.data,
      createdAt: activity.createdAt,
    }));
  }

  // Helper method to create an activity
  async createActivity(userId: string, type: string, data: any = {}): Promise<ActivityDto> {
    const newActivity = this.activityRepository.create({
      userId,
      type,
      data,
    });

    const savedActivity = await this.activityRepository.save(newActivity);
    
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    return {
      id: savedActivity.id,
      user: {
        id: user.id,
        username: user.username,
        profilePicture: user.profilePicture,
      },
      type: savedActivity.type,
      data: savedActivity.data,
      createdAt: savedActivity.createdAt,
    };
  }
}
