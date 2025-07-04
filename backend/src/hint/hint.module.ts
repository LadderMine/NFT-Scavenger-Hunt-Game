import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hint } from './hint.entity';
import { HintService } from './hint.service';
import { HintController } from './hint.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hint])],
  providers: [HintService],
  controllers: [HintController],
})
export class HintModule {}
