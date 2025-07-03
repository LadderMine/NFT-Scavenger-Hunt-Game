import { Module, type OnModuleInit } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { MilestoneTemplate } from "./entities/milestone-template.entity"
import { UserMilestone } from "./entities/user-milestone.entity"
import { UserProgress } from "./entities/user-progress.entity"
import { MilestoneTemplateService } from "./services/milestone-template.service"
import { UserProgressService } from "./services/user-progress.service"
import { MilestoneAssignmentService } from "./services/milestone-assignment.service"
import { MilestoneService } from "./services/milestone.service"
import { MilestoneController } from "./controllers/milestone.controller"
import { UserMilestoneController } from "./controllers/user-milestone.controller"

@Module({
  imports: [TypeOrmModule.forFeature([MilestoneTemplate, UserMilestone, UserProgress])],
  controllers: [MilestoneController, UserMilestoneController],
  providers: [MilestoneTemplateService, UserProgressService, MilestoneAssignmentService, MilestoneService],
  exports: [MilestoneService, MilestoneAssignmentService, UserProgressService],
})
export class MilestoneModule implements OnModuleInit {
  constructor(private readonly templateService: MilestoneTemplateService) {}

  async onModuleInit() {
    // Initialize default milestone templates when the module starts
    await this.templateService.initializeDefaultTemplates()
  }
}
