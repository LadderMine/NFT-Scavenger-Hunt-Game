import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { InviteFriendsController } from "./invite-friends.controller"
import { InviteFriendsService } from "./invite-friends.service"
import { Invite } from "./entities/invite.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Invite]), ConfigModule],
  controllers: [InviteFriendsController],
  providers: [InviteFriendsService],
  exports: [InviteFriendsService],
})
export class InviteFriendsModule {}

