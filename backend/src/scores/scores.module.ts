import { Module } from '@nestjs/common';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User])],
  controllers: [ScoresController],
  providers: [ScoresService]
})
export class ScoresModule {}
