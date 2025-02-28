import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialController } from './social.controller';
import { FollowService } from './follow.service';
import { Follow } from './entities/follow.entity';
import { Activity } from './entities/activity.entity';
import { User } from '../users/user.entity'; // Assuming User entity is already defined

@Module({
  imports: [TypeOrmModule.forFeature([Follow, Activity, User])],
  controllers: [SocialController],
  providers: [FollowService],
  exports: [FollowService],
})
export class SocialModule {}