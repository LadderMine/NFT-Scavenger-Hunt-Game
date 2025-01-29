/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateUserProvider } from './providers/create-user-provider.provider';
import { CreateUserDto } from './dtos/create-user-dto.dto';

@Injectable()
export class UsersService {
  constructor(private readonly createUserProvider: CreateUserProvider) {}

  public async createUser(createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUsers(createUserDto);
  }
}
