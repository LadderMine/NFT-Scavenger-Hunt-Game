import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { PuzzleTestCaseService } from "./services/puzzle-test-case.service"
import { ValidationService } from "./services/validation.service"
import { PuzzleTestCaseController } from "./controllers/puzzle-test-case.controller"
import { ValidationController } from "./controllers/validation.controller"
import { PuzzleTestCase } from "./entities/puzzle-test-case.entity"
import { ValidationResult } from "./entities/validation-result.entity"
import { AdminGuard } from "./guards/admin.guard"

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([PuzzleTestCase, ValidationResult])],
  providers: [PuzzleTestCaseService, ValidationService, AdminGuard],
  controllers: [PuzzleTestCaseController, ValidationController],
  exports: [PuzzleTestCaseService, ValidationService],
})
export class PuzzleTestCaseModule {}
