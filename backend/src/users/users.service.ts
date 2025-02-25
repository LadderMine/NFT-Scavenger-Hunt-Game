/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateUserProvider } from './providers/create-user-provider.provider';
import { CreateUserDto } from './dtos/create-user-dto.dto';
import { FindByUsername } from './providers/find-by-username.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly createUserProvider: CreateUserProvider,

    private readonly findByUsername: FindByUsername,
    @InjectRepository(User)
      private readonly userRepository: Repository<User>
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUsers(createUserDto);
  }

  public async FindByUsername(username: string) {
    return await this.findByUsername.FindOneByUsername(username);
  }

  public async findOneById(id: number) {
    return this.userRepository.findOneBy({id})
  }
}
