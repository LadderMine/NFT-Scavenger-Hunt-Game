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
}
