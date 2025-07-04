import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserReactionService } from "./user-reaction.service"
import { UserReactionController } from "./user-reaction.controller"
import { Reaction } from "./entities/reaction.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Reaction])],
  controllers: [UserReactionController],
  providers: [UserReactionService],
  exports: [UserReactionService], // Export service for potential use in other modules
})
export class UserReactionModule {}
