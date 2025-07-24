import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { LinkWalletDto } from './dto/link-wallet.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  create(@Body(new ValidationPipe({ whitelist: true })) dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  updateProfile(
    @Body(new ValidationPipe({ whitelist: true })) dto: UpdateUserProfileDto,
    @Param('id') /* or use custom decorator to get id */ 
    id: string,
  ) {
    return this.userService.updateProfile(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('link-wallet')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Link or update wallet address' })
  linkWallet(
    @Body(new ValidationPipe({ whitelist: true })) dto: LinkWalletDto,
    @Param('id') id: string,
  ) {
    return this.userService.linkWallet(id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  getById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
