// Main exports for the puzzle test case module
export { PuzzleTestCaseModule } from "./puzzle-test-case.module"
export { PuzzleTestCaseService } from "./services/puzzle-test-case.service"
export { ValidationService } from "./services/validation.service"
export { PuzzleTestCaseController } from "./controllers/puzzle-test-case.controller"
export { ValidationController } from "./controllers/validation.controller"
export { AdminGuard } from "./guards/admin.guard"
export { PuzzleTestCase, TestCaseType, ValidationMode } from "./entities/puzzle-test-case.entity"
export { ValidationResult, ValidationStatus } from "./entities/validation-result.entity"

// Interface and DTO exports
export * from "./interfaces/test-case.interface"
export * from "./dto/test-case.dto"
