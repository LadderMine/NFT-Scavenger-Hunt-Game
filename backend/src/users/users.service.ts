/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserProvider } from './providers/create-user-provider.provider';
import { CreateUserDto } from './dtos/create-user-dto.dto';
import { FindByUsername } from './providers/find-by-username.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly createUserProvider: CreateUserProvider,
    private readonly findByUsername: FindByUsername,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }


  public async createUser(createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUsers(createUserDto);
  }


  public async FindByUsername(username: string) {
    return await this.findByUsername.FindOneByUsername(username);
  }

  // Fetch all users
  public async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // Delete user by ID
  public async deleteUser(id: number): Promise<string> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    await this.userRepository.delete(id);
    return `User with ID ${id} deleted successfully.`;
  }

}


