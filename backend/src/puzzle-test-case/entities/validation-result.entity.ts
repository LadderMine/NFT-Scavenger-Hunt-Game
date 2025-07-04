import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm"

export enum ValidationStatus {
  PASSED = "passed",
  FAILED = "failed",
  ERROR = "error",
  TIMEOUT = "timeout",
  MEMORY_EXCEEDED = "memory_exceeded",
}

@Entity("validation_results")
@Index(["userId", "puzzleId", "createdAt"])
@Index(["puzzleId", "status"])
@Index(["createdAt"])
export class ValidationResult {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  puzzleId: string

  @Column({ type: "uuid", nullable: true })
  userId: string // null for anonymous validations

  @Column({ type: "uuid" })
  testCaseId: string

  @Column({
    type: "enum",
    enum: ValidationStatus,
  })
  status: ValidationStatus

  @Column({ type: "json" })
  submittedAnswer: {
    code?: string
    result?: any
    solution?: any
    [key: string]: any
  }

  @Column({ type: "json" })
  actualOutput: {
    result?: any
    output?: any
    error?: string
    [key: string]: any
  }

  @Column({ type: "json" })
  expectedOutput: {
    result?: any
    output?: any
    [key: string]: any
  }

  @Column({ type: "int" })
  executionTimeMs: number

  @Column({ type: "float", default: 0 })
  memoryUsageMB: number

  @Column({ type: "float", default: 0 })
  score: number // 0-1 based on test case weight

  @Column({ type: "text", nullable: true })
  errorMessage: string

  @Column({ type: "json", nullable: true })
  validationDetails: {
    comparisonResult?: any
    debugInfo?: any
    stackTrace?: string
    [key: string]: any
  }

  @CreateDateColumn()
  createdAt: Date
}
