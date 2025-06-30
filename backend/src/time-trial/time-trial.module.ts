import { Module } from '@nestjs/common';
import { TimetrialService } from './providers/timetrial.service';
import { TimeTrialController } from './time-trial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeTrial } from './time-trial.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TimeTrial])],
  providers: [TimetrialService],
  controllers: [TimeTrialController],
  exports: [TimetrialService]
})
export class TimeTrialModule {}
