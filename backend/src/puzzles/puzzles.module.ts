import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Puzzles } from "./puzzles.entity"
import { PuzzlesService } from "./puzzles.service"
import { PuzzlesController } from "./puzzles.controller"
import { Level } from "src/level/entities/level.entity"
import { Scores } from "src/scores/scores.entity"
import { NFTs } from "src/nfts/nfts.entity"
import { LevelService } from "src/level/level.service"
import { ScoresService } from "src/scores/scores.service"
import { NftsService } from "src/nfts/nfts.service"

@Module({
  imports: [TypeOrmModule.forFeature([Puzzles, Scores, Level, NFTs])],
  providers: [PuzzlesService, LevelService, ScoresService, NftsService],
  controllers: [PuzzlesController],
  exports: [PuzzlesService],
})
export class PuzzlesModule {}

