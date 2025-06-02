import { Module } from '@nestjs/common';
import { ReactionsService } from './providers/reactions-provider.service';
import { ReactionsController } from './reactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './reactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction])],
  providers: [ReactionsService],
  controllers: [ReactionsController]
})
export class ReactionsModule {}
