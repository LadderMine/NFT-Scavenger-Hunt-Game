import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryChapter } from './story-chapter.entity';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StoryChapter])],
  providers: [StoryService],
  controllers: [StoryController],
  exports: [StoryService],
})
export class StoryModule {}
