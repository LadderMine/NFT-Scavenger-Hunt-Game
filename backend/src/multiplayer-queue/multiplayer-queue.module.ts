import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ScheduleModule } from "@nestjs/schedule"
import { MultiplayerQueueService } from "./multiplayer-queue.service"
import { MultiplayerQueueController } from "./multiplayer-queue.controller"
import { Queue } from "./entities/queue.entity"
import { Match } from "./entities/match.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([Queue, Match]),
    ScheduleModule.forRoot(), // Enable cron jobs
  ],
  controllers: [MultiplayerQueueController],
  providers: [MultiplayerQueueService],
  exports: [MultiplayerQueueService], // Export for potential use in other modules
})
export class MultiplayerQueueModule {}
