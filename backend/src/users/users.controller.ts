/* eslint-disable prettier/prettier */
import { CreateUserDto } from './dtos/create-user-dto.dto';
import { Body, Controller, NotFoundException, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthTokenGuard } from '../auth/guard/auth-token/auth-token.guard';
import { Auth } from '../auth/decorators/auth-decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { UpdateUserDto } from './dtos/update-user-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @Auth(AuthType.None) // Doesn't need protection
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

/**update method */
  @Patch(':id')
  public updateUsers(
    @Body()updateUserDto:UpdateUserDto, 
    @Param('id', ParseIntPipe)id:number){
    
  return this.userService.updateUser(id, updateUserDto)
  }
}
