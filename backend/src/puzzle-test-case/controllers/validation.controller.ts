import { Controller, Post, Get, Logger } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from "@nestjs/swagger"
import type { ValidationService } from "../services/validation.service"
import type { ValidationRequest, ValidationResponse } from "../interfaces/test-case.interface"

@ApiTags("Puzzle Validation")
@Controller("puzzle-validation")
export class ValidationController {
  private readonly logger = new Logger(ValidationController.name)

  constructor(private readonly validationService: ValidationService) {}

  @Post("validate")
  @ApiOperation({
    summary: "Validate puzzle solution",
    description: "Validate a submitted answer against puzzle test cases",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["puzzleId", "submittedAnswer"],
      properties: {
        puzzleId: { type: "string", format: "uuid" },
        submittedAnswer: {
          type: "object",
          properties: {
            code: { type: "string" },
            result: { type: "any" },
            solution: { type: "any" },
          },
        },
        testCaseIds: {
          type: "array",
          items: { type: "string", format: "uuid" },
          description: "Optional: validate against specific test cases",
        },
        userId: { type: "string", format: "uuid", description: "Optional: user ID for tracking" },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Validation completed successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            overallScore: { type: "number" },
            totalTestCases: { type: "number" },
            passedTestCases: { type: "number" },
            failedTestCases: { type: "number" },
            results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  testCaseId: { type: "string" },
                  testCaseTitle: { type: "string" },
                  status: { type: "string" },
                  score: { type: "number" },
                  executionTimeMs: { type: "number" },
                  memoryUsageMB: { type: "number" },
                  isHidden: { type: "boolean" },
                },
              },
            },
            executionSummary: {
              type: "object",
              properties: {
                totalExecutionTime: { type: "number" },
                averageExecutionTime: { type: "number" },
                maxMemoryUsage: { type: "number" },
              },
            },
          },
        },
      },
    },
  })
  async validateAnswer(validationRequest: ValidationRequest): Promise<{
    success: boolean
    message: string
    data: ValidationResponse
  }> {
    this.logger.log(`Validating answer for puzzle: ${validationRequest.puzzleId}`)

    const result = await this.validationService.validateAnswer(validationRequest)

    return {
      success: result.success,
      message: `Validation completed: ${result.passedTestCases}/${result.totalTestCases} test cases passed`,
      data: result,
    }
  }

  @Get("history/:puzzleId")
  @ApiOperation({
    summary: "Get validation history",
    description: "Retrieve validation history for a puzzle",
  })
  @ApiParam({ name: "puzzleId", description: "Puzzle ID" })
  @ApiQuery({ name: "userId", required: false, description: "Filter by user ID" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Limit results (default: 50)" })
  @ApiResponse({
    status: 200,
    description: "Validation history retrieved successfully",
  })
  async getValidationHistory(puzzleId: string, userId?: string, limit?: number) {
    this.logger.log(`Getting validation history for puzzle: ${puzzleId}`)

    const history = await this.validationService.getValidationHistory(puzzleId, userId, limit)

    return {
      success: true,
      message: "Validation history retrieved successfully",
      data: history,
    }
  }
}
