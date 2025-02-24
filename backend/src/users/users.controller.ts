/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user-dto.dto';
import { AuthTokenGuard } from '../auth/guard/auth-token/auth-token.guard';
import { Auth } from '../auth/decorators/auth-decorator';
import { AuthType } from '../auth/enums/auth-type.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post()
  @Auth(AuthType.None) // Doesn't need protection
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // Fetch all users
  @Get()
  @UseGuards(AuthTokenGuard) // Protect this route
  @Auth(AuthType.Admin) // Only admins can fetch all users
  public findAllUsers() {
    return this.userService.findAllUsers();
  }

  // Delete a user by ID
  @Delete(':id')
  @UseGuards(AuthTokenGuard) // Protect this route
  @Auth(AuthType.Admin) // Only admins can delete users
  public async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
