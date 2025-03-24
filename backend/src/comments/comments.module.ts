import { Module } from '@nestjs/common';
import { CommentsService } from './providers/comment-providers.service';
import { CommentsController } from './comments.controller';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController]
})
export class CommentsModule {}
