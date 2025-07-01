// Main exports for the feedback module
export { FeedbackModule } from "./feedback.module"
export { FeedbackService } from "./services/feedback.service"
export { FeedbackController } from "./controllers/feedback.controller"
export { AdminGuard } from "./guards/admin.guard"
export { Feedback, TargetType } from "./entities/feedback.entity"

// Interface and DTO exports
export * from "./interfaces/feedback.interface"
export * from "./dto/feedback.dto"
