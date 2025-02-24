import { Module } from '@nestjs/common';
import { HintsController } from './hints.controller';
import { HintsService } from './hints.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hints } from './hints.entity';
import { Puzzles } from 'src/puzzles/puzzles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hints, Puzzles])],
  controllers: [HintsController],
  providers: [HintsService],
  exports: [HintsService],
  
})
export class HintsModule {}
