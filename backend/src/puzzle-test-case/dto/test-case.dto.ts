import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsOptional, IsEnum, IsUUID, IsObject, IsNumber, IsBoolean, Min, IsArray } from "class-validator"
import { TestCaseType, ValidationMode } from "../entities/puzzle-test-case.entity"

export class CreateTestCaseDto {
  @ApiProperty({
    description: "Puzzle ID this test case belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  puzzleId: string

  @ApiProperty({
    description: "Test case title",
    example: "Basic Addition Test",
  })
  @IsString()
  title: string

  @ApiProperty({
    description: "Test case description",
    required: false,
    example: "Tests basic addition functionality",
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: "Type of test case",
    enum: TestCaseType,
    required: false,
    default: TestCaseType.BASIC,
  })
  @IsOptional()
  @IsEnum(TestCaseType)
  testCaseType?: TestCaseType

  @ApiProperty({
    description: "Validation mode for comparing outputs",
    enum: ValidationMode,
    required: false,
    default: ValidationMode.EXACT_MATCH,
  })
  @IsOptional()
  @IsEnum(ValidationMode)
  validationMode?: ValidationMode

  @ApiProperty({
    description: "Test case input data",
    example: { parameters: [2, 3], data: { operation: "add" } },
  })
  @IsObject()
  input: {
    parameters?: any[]
    data?: any
    context?: any
    [key: string]: any
  }

  @ApiProperty({
    description: "Expected output for the test case",
    example: { result: 5, output: "2 + 3 = 5" },
  })
  @IsObject()
  expectedOutput: {
    result?: any
    output?: any
    returnValue?: any
    [key: string]: any
  }

  @ApiProperty({
    description: "Validation configuration",
    required: false,
    example: { tolerance: 0.001, ignoreCase: true },
  })
  @IsOptional()
  @IsObject()
  validationConfig?: {
    tolerance?: number
    ignoreCase?: boolean
    ignoreWhitespace?: boolean
    regexPattern?: string
    customValidatorCode?: string
    timeoutMs?: number
    memoryLimitMB?: number
    [key: string]: any
  }

  @ApiProperty({
    description: "Weight of this test case for scoring",
    required: false,
    default: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number

  @ApiProperty({
    description: "Execution timeout in milliseconds",
    required: false,
    default: 1000,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  timeoutMs?: number

  @ApiProperty({
    description: "Memory limit in megabytes",
    required: false,
    default: 128,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  memoryLimitMB?: number

  @ApiProperty({
    description: "Whether this test case is hidden from users",
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isHidden?: boolean

  @ApiProperty({
    description: "Whether this test case is shown as a sample to users",
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isSample?: boolean

  @ApiProperty({
    description: "Execution order of this test case",
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  executionOrder?: number

  @ApiProperty({
    description: "Additional metadata for the test case",
    required: false,
    example: { difficulty: "easy", tags: ["basic", "math"], author: "admin" },
  })
  @IsOptional()
  @IsObject()
  metadata?: {
    difficulty?: string
    tags?: string[]
    author?: string
    notes?: string
    [key: string]: any
  }
}

export class UpdateTestCaseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ enum: TestCaseType, required: false })
  @IsOptional()
  @IsEnum(TestCaseType)
  testCaseType?: TestCaseType

  @ApiProperty({ enum: ValidationMode, required: false })
  @IsOptional()
  @IsEnum(ValidationMode)
  validationMode?: ValidationMode

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  input?: any

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  expectedOutput?: any

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  validationConfig?: any

  @ApiProperty({ required: false, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number

  @ApiProperty({ required: false, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  timeoutMs?: number

  @ApiProperty({ required: false, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  memoryLimitMB?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isHidden?: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isSample?: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  executionOrder?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: any
}

export class ValidationRequestDto {
  @ApiProperty({
    description: "Puzzle ID to validate against",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  puzzleId: string

  @ApiProperty({
    description: "Submitted answer to validate",
    example: {
      code: "function add(a, b) { return a + b; }",
      result: 5,
      solution: "The answer is 5",
    },
  })
  @IsObject()
  submittedAnswer: {
    code?: string
    result?: any
    solution?: any
    [key: string]: any
  }

  @ApiProperty({
    description: "Optional: specific test case IDs to validate against",
    required: false,
    example: ["test-case-1", "test-case-2"],
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  testCaseIds?: string[]

  @ApiProperty({
    description: "Optional: user ID for tracking validation history",
    required: false,
    example: "user-123e4567-e89b-12d3-a456-426614174000",
  })
  @IsOptional()
  @IsUUID()
  userId?: string
}

export class BulkCreateTestCasesDto {
  @ApiProperty({
    description: "Array of test cases to create",
    type: [CreateTestCaseDto],
  })
  @IsArray()
  testCases: CreateTestCaseDto[]
}
