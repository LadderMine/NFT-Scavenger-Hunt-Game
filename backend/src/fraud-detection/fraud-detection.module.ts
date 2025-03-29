import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FraudDetectionController } from "./fraud-detection.controller"
import { FraudDetectionService } from "./fraud-detection.service"
import { FraudSuspect } from "./entities/fraud-suspect.entity"
import { FraudActivity } from "./entities/fraud-activity.entity"
import { FraudDetectionEventEmitter } from "./fraud-detection-event.emitter"
import { FraudDetectionEventListener } from "./fraud-detection-event.listener"

@Module({
  imports: [TypeOrmModule.forFeature([FraudSuspect, FraudActivity])],
  controllers: [FraudDetectionController],
  providers: [FraudDetectionService, FraudDetectionEventEmitter, FraudDetectionEventListener],
  exports: [FraudDetectionService],
})
export class FraudDetectionModule {}

