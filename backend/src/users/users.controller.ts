/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user-dto.dto';

// Guard Removed

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post()
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // Fetch all users (Now publicly accessible)
  @Get()
  public findAllUsers() {
    return this.userService.findAllUsers();
  }

  // Delete a user by ID (Now publicly accessible)
  @Delete(':id')
  public async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
