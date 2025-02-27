import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserProgressController } from "./user-progress.controller"
import { UserProgressService } from "./user-progress.service"
import { UserProgress } from "./user-progress.entity"
import { User } from "src/users/users.entity"
import { Hints } from "src/hints/hints.entity"
import { Puzzles } from "src/puzzles/puzzles.entity"
import { PuzzlesService } from "src/puzzles/puzzles.service"
import { HintsService } from "src/hints/hints.service"
import { UsersService } from "src/users/users.service"

@Module({
  imports: [TypeOrmModule.forFeature([UserProgress, User, Hints, Puzzles])],
  providers: [UserProgressService],
  controllers: [UserProgressController],
  exports: [UserProgressService],
})
export class UserProgressModule {}

