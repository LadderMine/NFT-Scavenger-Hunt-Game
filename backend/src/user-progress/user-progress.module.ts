import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserProgress } from "./userprogress.entity"
import { UserProgressController } from "./user-progress.controller"
import { UserProgressService } from "./user-progress.service"

@Module({
  imports: [TypeOrmModule.forFeature([UserProgress])],
  providers: [UserProgressService],
  controllers: [UserProgressController],
  exports: [UserProgressService],
})
export class UserProgressModule {}

