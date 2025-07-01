import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { FeedbackController } from "./controllers/feedback.controller"
import { FeedbackService } from "./services/feedback.service"
import { AdminGuard } from "./guards/admin.guard"
import { Feedback } from "./entities/feedback.entity"

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Feedback])],
  controllers: [FeedbackController],
  providers: [FeedbackService, AdminGuard],
  exports: [FeedbackService],
})
export class FeedbackModule {}
