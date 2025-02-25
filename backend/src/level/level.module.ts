import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { Level } from './entities/level.entity';
import { PuzzlesService } from 'src/puzzles/puzzles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Level])],
  controllers: [LevelController],
  providers: [LevelService, PuzzlesService], 
  exports: [LevelService],
})
export class LevelModule {}