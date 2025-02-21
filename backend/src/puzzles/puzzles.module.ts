import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Puzzles } from "./puzzles.entity"
import { PuzzlesService } from "./puzzles.service"
import { PuzzlesController } from "./puzzles.controller"

@Module({
  imports: [TypeOrmModule.forFeature([Puzzles])],
  providers: [PuzzlesService],
  controllers: [PuzzlesController],
  exports: [PuzzlesService],
})
export class PuzzlesModule {}

