import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { Level } from './entities/level.entity';
import { PuzzlesModule } from 'src/puzzles/puzzles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Level]), PuzzlesModule],
  controllers: [LevelController],
  providers: [LevelService], 
  exports: [LevelService],
})
export class LevelModule {}