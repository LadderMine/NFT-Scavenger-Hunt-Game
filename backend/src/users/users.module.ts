/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CreateUserProvider } from './providers/create-user-provider.provider';
import databaseConfig from 'config/database.config';
import { FindByUsername } from './providers/find-by-username.provider';
import { UserProgress } from 'src/user-progress/user-progress.entity';
import { ScoresService } from 'src/scores/scores.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User, CreateUserProvider, FindByUsername, ScoresService, UserProgress]),
    ConfigModule.forFeature(databaseConfig),
  ],
  controllers: [UsersController],
  providers: [UsersService, CreateUserProvider, FindByUsername],
  exports: [UsersService],
})
export class UsersModule {}
