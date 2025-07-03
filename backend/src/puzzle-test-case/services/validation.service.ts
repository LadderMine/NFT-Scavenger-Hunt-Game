import { Injectable, Logger, BadRequestException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { type PuzzleTestCase, ValidationMode } from "../entities/puzzle-test-case.entity"
import { type ValidationResult, ValidationStatus } from "../entities/validation-result.entity"
import type { PuzzleTestCaseService } from "./puzzle-test-case.service"
import type {
  ValidationRequest,
  ValidationResponse,
  TestCaseValidationResult,
  SubmittedAnswer,
} from "../interfaces/test-case.interface"

@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name)

  constructor(
    private readonly testCaseService: PuzzleTestCaseService,
    private readonly validationResultRepository: Repository<ValidationResult>,
  ) {}

  /**
   * Validate submitted answer against puzzle test cases
   */
  async validateAnswer(validationRequest: ValidationRequest): Promise<ValidationResponse> {
    this.logger.log(`Validating answer for puzzle: ${validationRequest.puzzleId}`)

    try {
      // Get test cases for validation
      const testCases = validationRequest.testCaseIds
        ? await this.getSpecificTestCases(validationRequest.testCaseIds)
        : await this.testCaseService.getValidationTestCases(validationRequest.puzzleId)

      if (testCases.length === 0) {
        throw new BadRequestException("No test cases found for validation")
      }

      const results: TestCaseValidationResult[] = []
      let totalScore = 0
      let totalWeight = 0
      let totalExecutionTime = 0
      let maxMemoryUsage = 0

      // Execute validation for each test case
      for (const testCase of testCases) {
        const startTime = Date.now()

        try {
          const validationResult = await this.executeTestCase(testCase, validationRequest.submittedAnswer)

          const executionTime = Date.now() - startTime
          totalExecutionTime += executionTime

          if (validationResult.memoryUsageMB > maxMemoryUsage) {
            maxMemoryUsage = validationResult.memoryUsageMB
          }

          // Calculate score based on test case weight
          const score = validationResult.status === ValidationStatus.PASSED ? testCase.weight : 0
          totalScore += score
          totalWeight += testCase.weight

          const result: TestCaseValidationResult = {
            testCaseId: testCase.id,
            testCaseTitle: testCase.title,
            status: validationResult.status,
            score: score / testCase.weight, // Normalized score (0-1)
            executionTimeMs: executionTime,
            memoryUsageMB: validationResult.memoryUsageMB,
            actualOutput: validationResult.actualOutput,
            expectedOutput: testCase.expectedOutput,
            errorMessage: validationResult.errorMessage,
            isHidden: testCase.isHidden,
          }

          results.push(result)

          // Store validation result
          await this.storeValidationResult({
            puzzleId: validationRequest.puzzleId,
            userId: validationRequest.userId,
            testCaseId: testCase.id,
            status: validationResult.status,
            submittedAnswer: validationRequest.submittedAnswer,
            actualOutput: validationResult.actualOutput,
            expectedOutput: testCase.expectedOutput,
            executionTimeMs: executionTime,
            memoryUsageMB: validationResult.memoryUsageMB,
            score: score / testCase.weight,
            errorMessage: validationResult.errorMessage,
            validationDetails: validationResult.validationDetails,
          })
        } catch (error) {
          this.logger.error(`Test case execution failed: ${testCase.id} - ${error.message}`)

          const result: TestCaseValidationResult = {
            testCaseId: testCase.id,
            testCaseTitle: testCase.title,
            status: ValidationStatus.ERROR,
            score: 0,
            executionTimeMs: Date.now() - startTime,
            memoryUsageMB: 0,
            actualOutput: null,
            expectedOutput: testCase.expectedOutput,
            errorMessage: error.message,
            isHidden: testCase.isHidden,
          }

          results.push(result)
          totalWeight += testCase.weight
        }
      }

      const overallScore = totalWeight > 0 ? totalScore / totalWeight : 0
      const passedTestCases = results.filter((r) => r.status === ValidationStatus.PASSED).length
      const failedTestCases = results.length - passedTestCases

      const response: ValidationResponse = {
        success: passedTestCases === results.length,
        overallScore,
        totalTestCases: results.length,
        passedTestCases,
        failedTestCases,
        results,
        executionSummary: {
          totalExecutionTime,
          averageExecutionTime: results.length > 0 ? totalExecutionTime / results.length : 0,
          maxMemoryUsage,
        },
      }

      this.logger.log(
        `Validation completed: ${passedTestCases}/${results.length} passed, score: ${overallScore.toFixed(2)}`,
      )

      return response
    } catch (error) {
      this.logger.error(`Validation failed: ${error.message}`)
      throw new BadRequestException(`Validation failed: ${error.message}`)
    }
  }

  /**
   * Execute a single test case
   */
  private async executeTestCase(
    testCase: PuzzleTestCase,
    submittedAnswer: SubmittedAnswer,
  ): Promise<{
    status: ValidationStatus
    actualOutput: any
    memoryUsageMB: number
    errorMessage?: string
    validationDetails?: any
  }> {
    try {
      // Simulate execution (in a real implementation, this would run the code)
      const actualOutput = await this.simulateExecution(testCase, submittedAnswer)

      // Validate the output based on validation mode
      const isValid = await this.validateOutput(testCase, actualOutput, testCase.expectedOutput)

      return {
        status: isValid ? ValidationStatus.PASSED : ValidationStatus.FAILED,
        actualOutput,
        memoryUsageMB: Math.random() * 10, // Simulated memory usage
        validationDetails: {
          validationMode: testCase.validationMode,
          comparisonResult: isValid,
        },
      }
    } catch (error) {
      return {
        status: ValidationStatus.ERROR,
        actualOutput: null,
        memoryUsageMB: 0,
        errorMessage: error.message,
      }
    }
  }

  /**
   * Simulate code execution (placeholder for actual execution engine)
   */
  private async simulateExecution(testCase: PuzzleTestCase, submittedAnswer: SubmittedAnswer): Promise<any> {
    // In a real implementation, this would:
    // 1. Execute the submitted code/solution
    // 2. Pass the test case input
    // 3. Capture the output
    // 4. Handle timeouts and memory limits

    // For now, we'll simulate by returning the submitted result
    if (submittedAnswer.result !== undefined) {
      return submittedAnswer.result
    }

    if (submittedAnswer.solution !== undefined) {
      return submittedAnswer.solution
    }

    // If it's code, we would execute it here
    if (submittedAnswer.code) {
      // Simulate code execution result
      return `Executed: ${submittedAnswer.code.substring(0, 50)}...`
    }

    throw new Error("No executable content found in submitted answer")
  }

  /**
   * Validate output based on validation mode
   */
  private async validateOutput(testCase: PuzzleTestCase, actualOutput: any, expectedOutput: any): Promise<boolean> {
    const config = testCase.validationConfig || {}

    switch (testCase.validationMode) {
      case ValidationMode.EXACT_MATCH:
        return this.exactMatch(actualOutput, expectedOutput, config)

      case ValidationMode.NUMERIC_TOLERANCE:
        return this.numericTolerance(actualOutput, expectedOutput, config)

      case ValidationMode.REGEX_MATCH:
        return this.regexMatch(actualOutput, expectedOutput, config)

      case ValidationMode.JSON_DEEP_EQUAL:
        return this.jsonDeepEqual(actualOutput, expectedOutput, config)

      case ValidationMode.ARRAY_UNORDERED:
        return this.arrayUnordered(actualOutput, expectedOutput, config)

      case ValidationMode.CUSTOM_FUNCTION:
        return this.customFunction(actualOutput, expectedOutput, config)

      default:
        return this.exactMatch(actualOutput, expectedOutput, config)
    }
  }

  /**
   * Exact match validation
   */
  private exactMatch(actual: any, expected: any, config: any): boolean {
    let actualStr = String(actual)
    let expectedStr = String(expected)

    if (config.ignoreCase) {
      actualStr = actualStr.toLowerCase()
      expectedStr = expectedStr.toLowerCase()
    }

    if (config.ignoreWhitespace) {
      actualStr = actualStr.replace(/\s+/g, "")
      expectedStr = expectedStr.replace(/\s+/g, "")
    }

    return actualStr === expectedStr
  }

  /**
   * Numeric tolerance validation
   */
  private numericTolerance(actual: any, expected: any, config: any): boolean {
    const actualNum = Number(actual)
    const expectedNum = Number(expected)

    if (Number.isNaN(actualNum) || Number.isNaN(expectedNum)) {
      return false
    }

    const tolerance = config.tolerance || 1e-9
    return Math.abs(actualNum - expectedNum) <= tolerance
  }

  /**
   * Regex match validation
   */
  private regexMatch(actual: any, expected: any, config: any): boolean {
    const pattern = config.regexPattern || String(expected)
    const regex = new RegExp(pattern, config.ignoreCase ? "i" : "")
    return regex.test(String(actual))
  }

  /**
   * JSON deep equal validation
   */
  private jsonDeepEqual(actual: any, expected: any, config: any): boolean {
    try {
      const actualObj = typeof actual === "string" ? JSON.parse(actual) : actual
      const expectedObj = typeof expected === "string" ? JSON.parse(expected) : expected
      return JSON.stringify(actualObj) === JSON.stringify(expectedObj)
    } catch {
      return false
    }
  }

  /**
   * Array unordered validation
   */
  private arrayUnordered(actual: any, expected: any, config: any): boolean {
    try {
      const actualArray = Array.isArray(actual) ? actual : JSON.parse(actual)
      const expectedArray = Array.isArray(expected) ? expected : JSON.parse(expected)

      if (!Array.isArray(actualArray) || !Array.isArray(expectedArray)) {
        return false
      }

      if (actualArray.length !== expectedArray.length) {
        return false
      }

      const sortedActual = [...actualArray].sort()
      const sortedExpected = [...expectedArray].sort()

      return JSON.stringify(sortedActual) === JSON.stringify(sortedExpected)
    } catch {
      return false
    }
  }

  /**
   * Custom function validation
   */
  private customFunction(actual: any, expected: any, config: any): boolean {
    try {
      // In a real implementation, this would safely execute custom validation code
      // For security, this should be sandboxed
      if (config.customValidatorCode) {
        // Placeholder for custom validation logic
        this.logger.warn("Custom function validation not implemented for security reasons")
      }
      return this.exactMatch(actual, expected, config)
    } catch {
      return false
    }
  }

  /**
   * Get specific test cases by IDs
   */
  private async getSpecificTestCases(testCaseIds: string[]): Promise<PuzzleTestCase[]> {
    const testCases = await Promise.all(
      testCaseIds.map(async (id) => {
        const testCase = await this.testCaseService.getTestCase(id)
        return testCase as any // Convert response back to entity for internal use
      }),
    )

    return testCases
  }

  /**
   * Store validation result
   */
  private async storeValidationResult(resultData: {
    puzzleId: string
    userId?: string
    testCaseId: string
    status: ValidationStatus
    submittedAnswer: SubmittedAnswer
    actualOutput: any
    expectedOutput: any
    executionTimeMs: number
    memoryUsageMB: number
    score: number
    errorMessage?: string
    validationDetails?: any
  }): Promise<void> {
    const validationResult = this.validationResultRepository.create({
      puzzleId: resultData.puzzleId,
      userId: resultData.userId,
      testCaseId: resultData.testCaseId,
      status: resultData.status,
      submittedAnswer: resultData.submittedAnswer,
      actualOutput: resultData.actualOutput,
      expectedOutput: resultData.expectedOutput,
      executionTimeMs: resultData.executionTimeMs,
      memoryUsageMB: resultData.memoryUsageMB,
      score: resultData.score,
      errorMessage: resultData.errorMessage,
      validationDetails: resultData.validationDetails,
    })

    await this.validationResultRepository.save(validationResult)
  }

  /**
   * Get validation history for a user and puzzle
   */
  async getValidationHistory(
    puzzleId: string,
    userId?: string,
    limit = 50,
  ): Promise<{
    results: ValidationResult[]
    summary: {
      totalAttempts: number
      bestScore: number
      averageScore: number
      lastAttempt?: Date
    }
  }> {
    this.logger.log(`Getting validation history for puzzle: ${puzzleId}`)

    const queryBuilder = this.validationResultRepository
      .createQueryBuilder("result")
      .where("result.puzzleId = :puzzleId", { puzzleId })

    if (userId) {
      queryBuilder.andWhere("result.userId = :userId", { userId })
    }

    const results = await queryBuilder.orderBy("result.createdAt", "DESC").limit(limit).getMany()

    // Calculate summary
    const totalAttempts = results.length
    const scores = results.map((r) => r.score)
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    const lastAttempt = results.length > 0 ? results[0].createdAt : undefined

    return {
      results,
      summary: {
        totalAttempts,
        bestScore,
        averageScore,
        lastAttempt,
      },
    }
  }
}
