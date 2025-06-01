import { Repository } from 'typeorm';
import { User } from './users.entity';
import { AuthService } from '../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto.dto';
/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FindByUsername } from './providers/find-by-username.provider';
import { Leaderboard } from 'src/leaderboard/entities/leaderboard.entity';
import { CreateUserProvider } from './providers/create-user-provider.provider';
import { InAppNotificationsService } from '../in-app-notifications/in-app-notifications.service';
import { InAppNotificationType } from '../in-app-notifications/entities/in-app-notification.entity';

@Injectable()
export class UsersService {  
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService, // Circular dependency injection of AuthService

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, // Dependency injection of User entity

    @InjectRepository(Leaderboard)
    private readonly leaderboardRepository: Repository<Leaderboard>, // Injecting the Leaderboard repository

    private readonly createUserProvider: CreateUserProvider, // Dependency injection of CreateUserProvider

    private readonly findByUsername: FindByUsername, // Dependency injection of FindByUsername

    private readonly inAppNotificationsService: InAppNotificationsService,

  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    // Create the user
    const createdUsers = await this.createUserProvider.createUsers(createUserDto);

    if (!createdUsers || createdUsers.length === 0) {
      throw new Error('User creation failed');
    }

    const newUser = createdUsers[0]; // Extract the first user from the array

    // Fetch the full user entity
    const userEntity = await this.usersRepository.findOne({
      where: { id: newUser.id },
    });

    if (!userEntity) {
      throw new NotFoundException('User not found after creation');
    }

    // Get the last rank (lowest rank) in the leaderboard
    const lastRank = await this.leaderboardRepository.count();

    // Create a leaderboard entry for the new user
    const leaderboardEntry = this.leaderboardRepository.create({
      user: userEntity, // Pass full user entity
      username: userEntity.username,
      profile_picture: null,
      total_points: 0,
      nfts_collected: 0,
      challenges_completed: 0,
      rank: lastRank + 1, // Assign lowest rank
    });

    await this.leaderboardRepository.save(leaderboardEntry);

    return newUser;
}


  public async FindByUsername(username: string) {
    return await this.findByUsername.FindOneByUsername(username);
  }

  async updateUserProfile(userId: number, updateData: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Update user profile
    Object.assign(user, updateData);
    await this.usersRepository.save(user);

    // Send notification about profile update
    await this.inAppNotificationsService.create({
      userId,
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated',
      type: InAppNotificationType.PROFILE_UPDATE,
      metadata: {
        updatedFields: Object.keys(updateData),
      },
    });

    return user;
  }

  async completeAchievement(userId: number, achievementName: string): Promise<void> {
    // ... achievement completion logic ...

    // Send achievement notification
    await this.inAppNotificationsService.create({
      userId,
      title: 'Achievement Unlocked!',
      message: `Congratulations! You've unlocked the "${achievementName}" achievement`,
      type: InAppNotificationType.ACHIEVEMENT,
      metadata: {
        achievementName,
        unlockedAt: new Date().toISOString(),
      },
    });
  }

  async sendWelcomeNotification(userId: number): Promise<void> {
    await this.inAppNotificationsService.create({
      userId,
      title: 'Welcome to NFT Scavenger Hunt!',
      message: 'Get ready for an exciting adventure in the world of NFTs',
      type: InAppNotificationType.WELCOME,
      priority: 5,
    });
  }
  async findAll(): Promise<User[]> {
  return this.usersRepository.find();
}
}
