import { Module } from '@nestjs/common';
import { ReactionsService } from './providers/reactions-provider.service';
import { ReactionsController } from './reactions.controller';

@Module({
  providers: [ReactionsService],
  controllers: [ReactionsController]
})
export class ReactionsModule {}
