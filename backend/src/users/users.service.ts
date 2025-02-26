/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserProvider } from './providers/create-user-provider.provider';
import { CreateUserDto } from './dtos/create-user-dto.dto';
import { FindByUsername } from './providers/find-by-username.provider';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user-dto';

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
  
  public async updateUser(id:number, updateUserDto:UpdateUserDto){
    const user = await this.userRepository.findOne({where:{id}})
    if(!user){
      throw new NotFoundException('No user was found')
    }
    Object.assign(user, updateUserDto)
    return this.userRepository.save(user)
  }
}
