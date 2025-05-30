import { Module } from '@nestjs/common';
import { ScheduleService } from './providers/schedule.service';

@Module({})
export class ScheduleModule {
    providers: [ScheduleService]
}
