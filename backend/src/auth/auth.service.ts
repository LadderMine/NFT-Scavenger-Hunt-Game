/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { forwardRef, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LogInProvider } from './providers/log-in.provider';
import { LogInDto } from './dto/log-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    private readonly logInProvider: LogInProvider,
  ) {}

  public async LogIn(logInDto: LogInDto) {
    return this.logInProvider.LogInToken(logInDto);
  }
}
