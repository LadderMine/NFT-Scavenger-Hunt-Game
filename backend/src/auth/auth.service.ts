/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { forwardRef, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LogInProvider } from './providers/log-in.provider';
import { LogInDto } from './dto/log-in.dto';
import { BcryptProvider } from './providers/bcrypt.provider';
import { GenerateTokenProvider } from './providers/generate-token.provider';

@Injectable()
export class AuthService {
  constructor(
    //circular dependency injection of user service
    @Inject(forwardRef(() => UsersService))  
    private readonly userService: UsersService,

     //dependency injection of logInProvider service
    private readonly logInProvider: LogInProvider,  
    
  ) {}

  public async LogIn(logInDto: LogInDto) {
    return this.logInProvider.LogInToken(logInDto);
  }
}
