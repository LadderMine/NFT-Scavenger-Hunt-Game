/* eslint-disable prettier/prettier */
import { CreateUserDto } from './dtos/create-user-dto.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthTokenGuard } from '../auth/guard/auth-token/auth-token.guard';
import { Auth } from '../auth/decorators/auth-decorator';
import { AuthType } from '../auth/enums/auth-type.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @Auth(AuthType.None) // Doesn't need protection
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
