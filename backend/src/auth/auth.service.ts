/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { forwardRef, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  findAll() {
    return `This action returns all auth`;
  }
  create() {
    return `This action returns all auth`;
  }
  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }
  update(id: number) {
    return `This action removes a #${id} auth`;
  }
  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
