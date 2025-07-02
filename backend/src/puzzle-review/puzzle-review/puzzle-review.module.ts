import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { PuzzleReviewService } from "./services/puzzle-review.service"
import { ModerationService } from "./services/moderation.service"
import { PuzzleReviewController } from "./controllers/puzzle-review.controller"
import { ModerationController } from "./controllers/moderation.controller"
import { PuzzleReview } from "./entities/puzzle-review.entity"
import { ReviewModeration } from "./entities/review-moderation.entity"
import { AdminGuard } from "./guards/admin.guard"

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([PuzzleReview, ReviewModeration])],
  providers: [PuzzleReviewService, ModerationService, AdminGuard],
  controllers: [PuzzleReviewController, ModerationController],
  exports: [PuzzleReviewService, ModerationService],
})
export class PuzzleReviewModule {}
