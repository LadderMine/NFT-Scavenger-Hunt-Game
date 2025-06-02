import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuzzleMatchingService } from './puzzle-matching.service';
import { PuzzleMatchingController } from './puzzle-matching.controller';
import { User } from '../users/users.entity';
import { Puzzles } from '../puzzles/puzzles.entity';
import { Scores } from '../scores/scores.entity';
import { Level } from '../level/entities/level.entity';
import { UserSkillProfile } from '../puzzle-matching/entities/user-skill-profile.entity';
import { UserSkillProfileService, RecommendationService } from './providers';
import { UsersModule } from '../users/users.module';
import { PuzzlesModule } from '../puzzles/puzzles.module';
import { ScoresModule } from '../scores/scores.module';
import { LevelModule } from '../level/level.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Puzzles, Scores, Level, UserSkillProfile]),
    UsersModule,
    PuzzlesModule,
    ScoresModule,
    LevelModule,
  ],
  controllers: [PuzzleMatchingController],
  providers: [PuzzleMatchingService, UserSkillProfileService, RecommendationService],
  exports: [PuzzleMatchingService],
})
export class PuzzleMatchingModule {}
