import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRankingController } from './user-ranking.controller';
import { UserRankingService } from './user-ranking.service';
import { UserRank } from './entities/user-ranking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRank])],
  controllers: [UserRankingController],
  providers: [UserRankingService],
  exports: [UserRankingService],
})
export class UserRankingModule {}