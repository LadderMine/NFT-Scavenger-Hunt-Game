import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  Logger,
  ParseUUIDPipe,
  ParseBoolPipe,
  DefaultValuePipe,
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth, ApiBody } from "@nestjs/swagger"
import type { PuzzleTestCaseService } from "../services/puzzle-test-case.service"
import { AdminGuard } from "../guards/admin.guard"
import { TestCaseType, ValidationMode } from "../entities/puzzle-test-case.entity"
import type {
  CreateTestCaseDto,
  UpdateTestCaseDto,
  TestCaseResponse,
  TestCaseStats,
  PuzzleTestCasesSummary,
} from "../interfaces/test-case.interface"

@ApiTags("Puzzle Test Cases")
@Controller("puzzle-test-cases")
export class PuzzleTestCaseController {
  private readonly logger = new Logger(PuzzleTestCaseController.name)

  constructor(private readonly testCaseService: PuzzleTestCaseService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create test case (Admin only)",
    description: "Create a new test case for a puzzle",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["puzzleId", "title", "input", "expectedOutput"],
      properties: {
        puzzleId: { type: "string", format: "uuid" },
        title: { type: "string" },
        description: { type: "string" },
        testCaseType: { type: "string", enum: Object.values(TestCaseType) },
        validationMode: { type: "string", enum: Object.values(ValidationMode) },
        input: { type: "object" },
        expectedOutput: { type: "object" },
        validationConfig: { type: "object" },
        weight: { type: "number", minimum: 0 },
        timeoutMs: { type: "number", minimum: 1 },
        memoryLimitMB: { type: "number", minimum: 1 },
        isHidden: { type: "boolean" },
        isSample: { type: "boolean" },
        executionOrder: { type: "number" },
        metadata: { type: "object" },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Test case created successfully",
  })
  async createTestCase(testCaseData: CreateTestCaseDto): Promise<{
    success: boolean
    message: string
    data: TestCaseResponse
  }> {
    this.logger.log(`Creating test case for puzzle: ${testCaseData.puzzleId}`)

    const testCase = await this.testCaseService.createTestCase(testCaseData)

    return {
      success: true,
      message: "Test case created successfully",
      data: testCase,
    }
  }

  @Put(":id")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update test case (Admin only)",
    description: "Update an existing test case",
  })
  @ApiParam({ name: "id", description: "Test case ID" })
  @ApiResponse({
    status: 200,
    description: "Test case updated successfully",
  })
  async updateTestCase(
    id: string,
    updateData: UpdateTestCaseDto,
  ): Promise<{
    success: boolean
    message: string
    data: TestCaseResponse
  }> {
    this.logger.log(`Updating test case: ${id}`)

    const testCase = await this.testCaseService.updateTestCase(id, updateData)

    return {
      success: true,
      message: "Test case updated successfully",
      data: testCase,
    }
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete test case (Admin only)",
    description: "Delete a test case",
  })
  @ApiParam({ name: "id", description: "Test case ID" })
  @ApiResponse({
    status: 200,
    description: "Test case deleted successfully",
  })
  async deleteTestCase(@Param("id", ParseUUIDPipe) id: string): Promise<{
    success: boolean
    message: string
  }> {
    this.logger.log(`Deleting test case: ${id}`)

    await this.testCaseService.deleteTestCase(id)

    return {
      success: true,
      message: "Test case deleted successfully",
    }
  }

  @Get(":id")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get test case (Admin only)",
    description: "Retrieve a specific test case by ID",
  })
  @ApiParam({ name: "id", description: "Test case ID" })
  @ApiResponse({
    status: 200,
    description: "Test case retrieved successfully",
  })
  async getTestCase(@Param("id", ParseUUIDPipe) id: string): Promise<{
    success: boolean
    message: string
    data: TestCaseResponse
  }> {
    this.logger.log(`Getting test case: ${id}`)

    const testCase = await this.testCaseService.getTestCase(id)

    return {
      success: true,
      message: "Test case retrieved successfully",
      data: testCase,
    }
  }

  @Get("puzzle/:puzzleId")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get puzzle test cases (Admin only)",
    description: "Retrieve all test cases for a specific puzzle",
  })
  @ApiParam({ name: "puzzleId", description: "Puzzle ID" })
  @ApiQuery({
    name: "includeHidden",
    required: false,
    type: Boolean,
    description: "Include hidden test cases",
  })
  @ApiQuery({
    name: "includeInactive",
    required: false,
    type: Boolean,
    description: "Include inactive test cases",
  })
  @ApiResponse({
    status: 200,
    description: "Test cases retrieved successfully",
  })
  async getPuzzleTestCases(
    @Param("puzzleId", ParseUUIDPipe) puzzleId: string,
    @Query("includeHidden", new DefaultValuePipe(false), ParseBoolPipe) includeHidden: boolean,
    @Query("includeInactive", new DefaultValuePipe(false), ParseBoolPipe) includeInactive: boolean,
  ): Promise<{
    success: boolean
    message: string
    data: TestCaseResponse[]
  }> {
    this.logger.log(`Getting test cases for puzzle: ${puzzleId}`)

    const testCases = await this.testCaseService.getPuzzleTestCases(puzzleId, includeHidden, includeInactive)

    return {
      success: true,
      message: "Test cases retrieved successfully",
      data: testCases,
    }
  }

  @Get("puzzle/:puzzleId/samples")
  @ApiOperation({
    summary: "Get sample test cases",
    description: "Retrieve sample test cases for a puzzle (visible to users)",
  })
  @ApiParam({ name: "puzzleId", description: "Puzzle ID" })
  @ApiResponse({
    status: 200,
    description: "Sample test cases retrieved successfully",
  })
  async getSampleTestCases(@Param("puzzleId", ParseUUIDPipe) puzzleId: string): Promise<{
    success: boolean
    message: string
    data: TestCaseResponse[]
  }> {
    this.logger.log(`Getting sample test cases for puzzle: ${puzzleId}`)

    const testCases = await this.testCaseService.getSampleTestCases(puzzleId)

    return {
      success: true,
      message: "Sample test cases retrieved successfully",
      data: testCases,
    }
  }

  @Get("puzzle/:puzzleId/summary")
  @ApiOperation({
    summary: "Get puzzle test cases summary",
    description: "Get a summary of test cases for a specific puzzle",
  })
  @ApiParam({ name: "puzzleId", description: "Puzzle ID" })
  @ApiResponse({
    status: 200,
    description: "Test cases summary retrieved successfully",
  })
  async getPuzzleTestCasesSummary(@Param("puzzleId", ParseUUIDPipe) puzzleId: string): Promise<{
    success: boolean
    message: string
    data: PuzzleTestCasesSummary
  }> {
    this.logger.log(`Getting test cases summary for puzzle: ${puzzleId}`)

    const summary = await this.testCaseService.getPuzzleTestCasesSummary(puzzleId)

    return {
      success: true,
      message: "Test cases summary retrieved successfully",
      data: summary,
    }
  }

  @Get("stats")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get test case statistics (Admin only)",
    description: "Retrieve comprehensive test case statistics",
  })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
  })
  async getTestCaseStats(): Promise<{
    success: boolean
    message: string
    data: TestCaseStats
  }> {
    this.logger.log("Getting test case statistics")

    const stats = await this.testCaseService.getTestCaseStats()

    return {
      success: true,
      message: "Statistics retrieved successfully",
      data: stats,
    }
  }

  @Post("bulk")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Bulk create test cases (Admin only)",
    description: "Create multiple test cases at once",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["testCases"],
      properties: {
        testCases: {
          type: "array",
          items: {
            type: "object",
            // Same properties as single test case creation
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Test cases created successfully",
  })
  async bulkCreateTestCases(body: { testCases: CreateTestCaseDto[] }): Promise<{
    success: boolean
    message: string
    data: TestCaseResponse[]
  }> {
    this.logger.log(`Bulk creating ${body.testCases.length} test cases`)

    const testCases = await this.testCaseService.bulkCreateTestCases(body.testCases)

    return {
      success: true,
      message: `${testCases.length} test cases created successfully`,
      data: testCases,
    }
  }
}
