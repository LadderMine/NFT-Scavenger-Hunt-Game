import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserProgressController } from "./user-progress.controller"
import { UserProgressService } from "./user-progress.service"
import { UserProgress } from "./UserProgress.entity"

@Module({
  imports: [TypeOrmModule.forFeature([UserProgress])],
  providers: [UserProgressService],
  controllers: [UserProgressController],
  exports: [UserProgressService],
})
export class UserProgressModule {}

