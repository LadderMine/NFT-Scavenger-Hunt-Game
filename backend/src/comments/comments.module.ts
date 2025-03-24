import { Module } from '@nestjs/common';
import { CommentsService } from './providers/comment-providers.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [CommentsService],
  controllers: [CommentsController]
})
export class CommentsModule {}
