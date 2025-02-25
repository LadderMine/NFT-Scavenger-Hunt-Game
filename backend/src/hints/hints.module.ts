import { Module } from '@nestjs/common';
import { HintsController } from './hints.controller';
import { HintsService } from './hints.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hints } from './hints.entity';
import { PuzzlesService } from 'src/puzzles/puzzles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hints])],
  controllers: [HintsController],
  providers: [HintsService, PuzzlesService],
  exports: [HintsService],
  
})
export class HintsModule {}
