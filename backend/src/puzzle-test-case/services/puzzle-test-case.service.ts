import { Injectable, Logger, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { type PuzzleTestCase, TestCaseType, ValidationMode } from "../entities/puzzle-test-case.entity"
import type {
  CreateTestCaseDto,
  UpdateTestCaseDto,
  TestCaseResponse,
  TestCaseStats,
  PuzzleTestCasesSummary,
} from "../interfaces/test-case.interface"

@Injectable()
export class PuzzleTestCaseService {
  private readonly logger = new Logger(PuzzleTestCaseService.name)

  constructor(private readonly testCaseRepository: Repository<PuzzleTestCase>) {}

  /**
   * Create a new test case
   */
  async createTestCase(testCaseData: CreateTestCaseDto): Promise<TestCaseResponse> {
    this.logger.log(`Creating test case for puzzle: ${testCaseData.puzzleId}`)

    try {
      // Validate input data
      this.validateTestCaseData(testCaseData)

      const testCase = this.testCaseRepository.create({
        puzzleId: testCaseData.puzzleId,
        title: testCaseData.title,
        description: testCaseData.description,
        testCaseType: testCaseData.testCaseType || TestCaseType.BASIC,
        validationMode: testCaseData.validationMode || ValidationMode.EXACT_MATCH,
        input: testCaseData.input,
        expectedOutput: testCaseData.expectedOutput,
        validationConfig: testCaseData.validationConfig || {},
        weight: testCaseData.weight || 1,
        timeoutMs: testCaseData.timeoutMs || 1000,
        memoryLimitMB: testCaseData.memoryLimitMB || 128,
        isHidden: testCaseData.isHidden || false,
        isSample: testCaseData.isSample || false,
        executionOrder: testCaseData.executionOrder || 0,
        metadata: testCaseData.metadata || {},
      })

      const savedTestCase = await this.testCaseRepository.save(testCase)

      this.logger.log(`Test case created successfully: ${savedTestCase.id}`)

      return this.mapToResponse(savedTestCase)
    } catch (error) {
      this.logger.error(`Failed to create test case: ${error.message}`)
      throw new BadRequestException(`Failed to create test case: ${error.message}`)
    }
  }

  /**
   * Update an existing test case
   */
  async updateTestCase(id: string, updateData: UpdateTestCaseDto): Promise<TestCaseResponse> {
    this.logger.log(`Updating test case: ${id}`)

    const testCase = await this.testCaseRepository.findOne({ where: { id } })

    if (!testCase) {
      throw new NotFoundException("Test case not found")
    }

    // Update fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        testCase[key] = updateData[key]
      }
    })

    const updatedTestCase = await this.testCaseRepository.save(testCase)

    this.logger.log(`Test case updated successfully: ${id}`)

    return this.mapToResponse(updatedTestCase)
  }

  /**
   * Delete a test case
   */
  async deleteTestCase(id: string): Promise<void> {
    this.logger.log(`Deleting test case: ${id}`)

    const result = await this.testCaseRepository.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException("Test case not found")
    }

    this.logger.log(`Test case deleted successfully: ${id}`)
  }

  /**
   * Get test case by ID
   */
  async getTestCase(id: string): Promise<TestCaseResponse> {
    const testCase = await this.testCaseRepository.findOne({ where: { id } })

    if (!testCase) {
      throw new NotFoundException("Test case not found")
    }

    return this.mapToResponse(testCase)
  }

  /**
   * Get all test cases for a puzzle
   */
  async getPuzzleTestCases(
    puzzleId: string,
    includeHidden = false,
    includeInactive = false,
  ): Promise<TestCaseResponse[]> {
    this.logger.log(`Fetching test cases for puzzle: ${puzzleId}`)

    const queryBuilder = this.testCaseRepository
      .createQueryBuilder("testCase")
      .where("testCase.puzzleId = :puzzleId", { puzzleId })

    if (!includeHidden) {
      queryBuilder.andWhere("testCase.isHidden = :isHidden", { isHidden: false })
    }

    if (!includeInactive) {
      queryBuilder.andWhere("testCase.isActive = :isActive", { isActive: true })
    }

    const testCases = await queryBuilder.orderBy("testCase.executionOrder", "ASC").getMany()

    return testCases.map((testCase) => this.mapToResponse(testCase))
  }

  /**
   * Get sample test cases for a puzzle (visible to users)
   */
  async getSampleTestCases(puzzleId: string): Promise<TestCaseResponse[]> {
    this.logger.log(`Fetching sample test cases for puzzle: ${puzzleId}`)

    const testCases = await this.testCaseRepository.find({
      where: {
        puzzleId,
        isSample: true,
        isActive: true,
      },
      order: {
        executionOrder: "ASC",
      },
    })

    return testCases.map((testCase) => this.mapToResponse(testCase))
  }

  /**
   * Get active test cases for validation
   */
  async getValidationTestCases(puzzleId: string): Promise<PuzzleTestCase[]> {
    this.logger.log(`Fetching validation test cases for puzzle: ${puzzleId}`)

    return await this.testCaseRepository.find({
      where: {
        puzzleId,
        isActive: true,
      },
      order: {
        executionOrder: "ASC",
      },
    })
  }

  /**
   * Get test case statistics
   */
  async getTestCaseStats(): Promise<TestCaseStats> {
    this.logger.log("Calculating test case statistics")

    const [totalTestCases, testCasesByType, testCasesByValidationMode, avgExecutionTime, recentValidations] =
      await Promise.all([
        // Total test cases
        this.testCaseRepository.count(),

        // Test cases by type
        this.testCaseRepository
          .createQueryBuilder("testCase")
          .select("testCase.testCaseType", "testCaseType")
          .addSelect("COUNT(*)", "count")
          .groupBy("testCase.testCaseType")
          .getRawMany(),

        // Test cases by validation mode
        this.testCaseRepository
          .createQueryBuilder("testCase")
          .select("testCase.validationMode", "validationMode")
          .addSelect("COUNT(*)", "count")
          .groupBy("testCase.validationMode")
          .getRawMany(),

        // Average execution time (from timeout settings)
        this.testCaseRepository
          .createQueryBuilder("testCase")
          .select("AVG(testCase.timeoutMs)", "average")
          .getRawOne(),

        // Recent validations count (last 7 days)
        this.testCaseRepository.count({
          where: {
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        }),
      ])

    // Process results
    const typeDistribution = Object.values(TestCaseType).reduce(
      (acc, type) => {
        acc[type] = 0
        return acc
      },
      {} as Record<TestCaseType, number>,
    )

    testCasesByType.forEach((item) => {
      typeDistribution[item.testCaseType] = Number.parseInt(item.count)
    })

    const modeDistribution = Object.values(ValidationMode).reduce(
      (acc, mode) => {
        acc[mode] = 0
        return acc
      },
      {} as Record<ValidationMode, number>,
    )

    testCasesByValidationMode.forEach((item) => {
      modeDistribution[item.validationMode] = Number.parseInt(item.count)
    })

    return {
      totalTestCases,
      testCasesByType: typeDistribution,
      testCasesByValidationMode: modeDistribution,
      averageExecutionTime: Number.parseFloat(avgExecutionTime?.average || "0"),
      successRate: 0, // Would need validation results to calculate
      recentValidations,
    }
  }

  /**
   * Get puzzle test cases summary
   */
  async getPuzzleTestCasesSummary(puzzleId: string): Promise<PuzzleTestCasesSummary> {
    this.logger.log(`Getting test cases summary for puzzle: ${puzzleId}`)

    const [totalTestCases, activeTestCases, hiddenTestCases, sampleTestCases, testCaseDetails, avgWeight] =
      await Promise.all([
        // Total test cases
        this.testCaseRepository.count({ where: { puzzleId } }),

        // Active test cases
        this.testCaseRepository.count({ where: { puzzleId, isActive: true } }),

        // Hidden test cases
        this.testCaseRepository.count({ where: { puzzleId, isHidden: true } }),

        // Sample test cases
        this.testCaseRepository.count({ where: { puzzleId, isSample: true } }),

        // Test case details for types and modes
        this.testCaseRepository.find({
          where: { puzzleId },
          select: ["testCaseType", "validationMode", "updatedAt"],
        }),

        // Average weight
        this.testCaseRepository
          .createQueryBuilder("testCase")
          .select("AVG(testCase.weight)", "average")
          .where("testCase.puzzleId = :puzzleId", { puzzleId })
          .getRawOne(),
      ])

    const testCaseTypes = [...new Set(testCaseDetails.map((tc) => tc.testCaseType))]
    const validationModes = [...new Set(testCaseDetails.map((tc) => tc.validationMode))]
    const lastUpdated =
      testCaseDetails.length > 0
        ? new Date(Math.max(...testCaseDetails.map((tc) => tc.updatedAt.getTime())))
        : undefined

    return {
      puzzleId,
      totalTestCases,
      activeTestCases,
      hiddenTestCases,
      sampleTestCases,
      testCaseTypes,
      validationModes,
      averageWeight: Number.parseFloat(avgWeight?.average || "0"),
      lastUpdated,
    }
  }

  /**
   * Bulk create test cases
   */
  async bulkCreateTestCases(testCasesData: CreateTestCaseDto[]): Promise<TestCaseResponse[]> {
    this.logger.log(`Bulk creating ${testCasesData.length} test cases`)

    const results: TestCaseResponse[] = []
    const errors: string[] = []

    for (const testCaseData of testCasesData) {
      try {
        const result = await this.createTestCase(testCaseData)
        results.push(result)
      } catch (error) {
        errors.push(`Failed to create test case "${testCaseData.title}": ${error.message}`)
      }
    }

    if (errors.length > 0) {
      this.logger.warn(`Bulk creation completed with ${errors.length} errors`)
    }

    return results
  }

  /**
   * Validate test case data
   */
  private validateTestCaseData(testCaseData: CreateTestCaseDto): void {
    if (!testCaseData.puzzleId) {
      throw new BadRequestException("Puzzle ID is required")
    }

    if (!testCaseData.title || testCaseData.title.trim().length === 0) {
      throw new BadRequestException("Title is required")
    }

    if (!testCaseData.input) {
      throw new BadRequestException("Input is required")
    }

    if (!testCaseData.expectedOutput) {
      throw new BadRequestException("Expected output is required")
    }

    if (testCaseData.weight && testCaseData.weight < 0) {
      throw new BadRequestException("Weight must be non-negative")
    }

    if (testCaseData.timeoutMs && testCaseData.timeoutMs < 1) {
      throw new BadRequestException("Timeout must be at least 1ms")
    }

    if (testCaseData.memoryLimitMB && testCaseData.memoryLimitMB < 1) {
      throw new BadRequestException("Memory limit must be at least 1MB")
    }
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponse(testCase: PuzzleTestCase): TestCaseResponse {
    return {
      id: testCase.id,
      puzzleId: testCase.puzzleId,
      title: testCase.title,
      description: testCase.description,
      testCaseType: testCase.testCaseType,
      validationMode: testCase.validationMode,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      validationConfig: testCase.validationConfig,
      weight: testCase.weight,
      timeoutMs: testCase.timeoutMs,
      memoryLimitMB: testCase.memoryLimitMB,
      isActive: testCase.isActive,
      isHidden: testCase.isHidden,
      isSample: testCase.isSample,
      executionOrder: testCase.executionOrder,
      metadata: testCase.metadata,
      createdAt: testCase.createdAt,
      updatedAt: testCase.updatedAt,
    }
  }
}
