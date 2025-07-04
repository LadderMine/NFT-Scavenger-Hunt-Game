import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

export enum TestCaseType {
  BASIC = "basic",
  EDGE_CASE = "edge_case",
  PERFORMANCE = "performance",
  HIDDEN = "hidden", // Not visible to users
  SAMPLE = "sample", // Visible to users as examples
}

export enum ValidationMode {
  EXACT_MATCH = "exact_match",
  NUMERIC_TOLERANCE = "numeric_tolerance",
  REGEX_MATCH = "regex_match",
  CUSTOM_FUNCTION = "custom_function",
  JSON_DEEP_EQUAL = "json_deep_equal",
  ARRAY_UNORDERED = "array_unordered",
}

@Entity("puzzle_test_cases")
@Index(["puzzleId", "isActive"])
@Index(["puzzleId", "testCaseType"])
@Index(["isActive", "createdAt"])
export class PuzzleTestCase {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  puzzleId: string

  @Column({ length: 255 })
  title: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({
    type: "enum",
    enum: TestCaseType,
    default: TestCaseType.BASIC,
  })
  testCaseType: TestCaseType

  @Column({
    type: "enum",
    enum: ValidationMode,
    default: ValidationMode.EXACT_MATCH,
  })
  validationMode: ValidationMode

  @Column({ type: "json" })
  input: {
    parameters?: any[]
    data?: any
    context?: any
    [key: string]: any
  }

  @Column({ type: "json" })
  expectedOutput: {
    result?: any
    output?: any
    returnValue?: any
    [key: string]: any
  }

  @Column({ type: "json", nullable: true })
  validationConfig: {
    tolerance?: number // For numeric comparisons
    ignoreCase?: boolean
    ignoreWhitespace?: boolean
    regexPattern?: string
    customValidatorCode?: string
    timeoutMs?: number
    memoryLimitMB?: number
    [key: string]: any
  }

  @Column({ type: "int", default: 1 })
  weight: number // Weight for scoring

  @Column({ type: "int", default: 1000 })
  timeoutMs: number

  @Column({ type: "int", default: 128 })
  memoryLimitMB: number

  @Column({ default: true })
  isActive: boolean

  @Column({ default: false })
  isHidden: boolean // Hidden from users

  @Column({ default: false })
  isSample: boolean // Show as example to users

  @Column({ type: "int", default: 0 })
  executionOrder: number // Order of execution

  @Column({ type: "json", nullable: true })
  metadata: {
    difficulty?: string
    tags?: string[]
    author?: string
    notes?: string
    [key: string]: any
  }

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
