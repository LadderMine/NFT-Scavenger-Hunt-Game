/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Patch,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user-dto.dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { AuthTokenGuard } from '../auth/guard/auth-token/auth-token.guard';
import { Auth } from '../auth/decorators/auth-decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @Auth(AuthType.None)
  @Public()
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // Fetch all users (Publicly accessible)
  @Get()
  public findAllUsers() {
    return this.userService.findAllUsers();
  }

  // Update user by ID
  @Patch(':id')
  public updateUsers(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  // Delete a user by ID (Publicly accessible)
  @Delete(':id')
  public async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}