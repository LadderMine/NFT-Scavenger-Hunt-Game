import { Module } from '@nestjs/common';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { PuzzlesService } from 'src/puzzles/puzzles.service';
import { Puzzles } from 'src/puzzles/puzzles.entity';
import { Scores } from './scores.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, Puzzles, Scores])],
  controllers: [ScoresController],
  providers: [ScoresService],
  exports: [ScoresService]
})
export class ScoresModule {}
