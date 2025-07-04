import type { TestCaseType, ValidationMode } from "../entities/puzzle-test-case.entity"
import type { ValidationStatus } from "../entities/validation-result.entity"

export interface CreateTestCaseDto {
  puzzleId: string
  title: string
  description?: string
  testCaseType?: TestCaseType
  validationMode?: ValidationMode
  input: TestCaseInput
  expectedOutput: TestCaseOutput
  validationConfig?: ValidationConfig
  weight?: number
  timeoutMs?: number
  memoryLimitMB?: number
  isHidden?: boolean
  isSample?: boolean
  executionOrder?: number
  metadata?: TestCaseMetadata
}

export interface TestCaseInput {
  parameters?: any[]
  data?: any
  context?: any
  [key: string]: any
}

export interface TestCaseOutput {
  result?: any
  output?: any
  returnValue?: any
  [key: string]: any
}

export interface ValidationConfig {
  tolerance?: number
  ignoreCase?: boolean
  ignoreWhitespace?: boolean
  regexPattern?: string
  customValidatorCode?: string
  timeoutMs?: number
  memoryLimitMB?: number
  [key: string]: any
}

export interface TestCaseMetadata {
  difficulty?: string
  tags?: string[]
  author?: string
  notes?: string
  [key: string]: any
}

export interface UpdateTestCaseDto {
  title?: string
  description?: string
  testCaseType?: TestCaseType
  validationMode?: ValidationMode
  input?: TestCaseInput
  expectedOutput?: TestCaseOutput
  validationConfig?: ValidationConfig
  weight?: number
  timeoutMs?: number
  memoryLimitMB?: number
  isActive?: boolean
  isHidden?: boolean
  isSample?: boolean
  executionOrder?: number
  metadata?: TestCaseMetadata
}

export interface TestCaseResponse {
  id: string
  puzzleId: string
  title: string
  description?: string
  testCaseType: TestCaseType
  validationMode: ValidationMode
  input: TestCaseInput
  expectedOutput: TestCaseOutput
  validationConfig?: ValidationConfig
  weight: number
  timeoutMs: number
  memoryLimitMB: number
  isActive: boolean
  isHidden: boolean
  isSample: boolean
  executionOrder: number
  metadata?: TestCaseMetadata
  createdAt: Date
  updatedAt: Date
}

export interface ValidationRequest {
  puzzleId: string
  submittedAnswer: SubmittedAnswer
  testCaseIds?: string[] // Optional: validate against specific test cases
  userId?: string
}

export interface SubmittedAnswer {
  code?: string
  result?: any
  solution?: any
  [key: string]: any
}

export interface ValidationResponse {
  success: boolean
  overallScore: number
  totalTestCases: number
  passedTestCases: number
  failedTestCases: number
  results: TestCaseValidationResult[]
  executionSummary: {
    totalExecutionTime: number
    averageExecutionTime: number
    maxMemoryUsage: number
  }
}

export interface TestCaseValidationResult {
  testCaseId: string
  testCaseTitle: string
  status: ValidationStatus
  score: number
  executionTimeMs: number
  memoryUsageMB: number
  actualOutput: any
  expectedOutput: any
  errorMessage?: string
  isHidden: boolean
}

export interface TestCaseStats {
  totalTestCases: number
  testCasesByType: Record<TestCaseType, number>
  testCasesByValidationMode: Record<ValidationMode, number>
  averageExecutionTime: number
  successRate: number
  recentValidations: number
}

export interface PuzzleTestCasesSummary {
  puzzleId: string
  totalTestCases: number
  activeTestCases: number
  hiddenTestCases: number
  sampleTestCases: number
  testCaseTypes: TestCaseType[]
  validationModes: ValidationMode[]
  averageWeight: number
  lastUpdated?: Date
}
