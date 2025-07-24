import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentRating } from './entities/content-rating.entity';
import { ContentRatingService } from './content-rating.service';
import { ContentRatingController } from './content-rating.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContentRating])],
  controllers: [ContentRatingController],
  providers: [ContentRatingService],
})
export class ContentRatingModule {}
