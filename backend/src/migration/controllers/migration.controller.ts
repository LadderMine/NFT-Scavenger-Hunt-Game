import {
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiSecurity, ApiBearerAuth } from "@nestjs/swagger"
import type { JsonParserService } from "../services/json-parser.service"
import type { MigrationService } from "../services/migration.service"
import { AdminGuard } from "../guards/admin.guard"
import type { MigrationResult } from "../interfaces/puzzle.interface"
import { unlinkSync } from "fs"
import type { Express } from "express"

@ApiTags("Migration")
@ApiBearerAuth()
@ApiSecurity("bearer")
@Controller("migration")
@UseGuards(AdminGuard)
export class MigrationController {
  private readonly logger = new Logger(MigrationController.name)

  constructor(
    private readonly jsonParserService: JsonParserService,
    private readonly migrationService: MigrationService,
  ) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({
    summary: "Upload and migrate puzzle data from JSON file",
    description: "Upload a JSON file containing puzzle data to be parsed and migrated to the database",
  })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 200,
    description: "File uploaded and processed successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        result: {
          type: "object",
          properties: {
            summary: {
              type: "object",
              properties: {
                totalProcessed: { type: "number" },
                successfulInserts: { type: "number" },
                failedInserts: { type: "number" },
                duplicatesSkipped: { type: "number" },
              },
            },
            uploadInfo: {
              type: "object",
              properties: {
                filename: { type: "string" },
                fileSize: { type: "number" },
                uploadedAt: { type: "string", format: "date-time" },
                uploadedBy: { type: "string" },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid file or data",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Admin access required",
  })
  async uploadPuzzleData(
    file: Express.Multer.File,
    body: any,
    // user: any, // Assuming you have a User decorator
  ): Promise<{
    success: boolean
    message: string
    result?: MigrationResult
    parseErrors?: any[]
  }> {
    if (!file) {
      throw new BadRequestException("No file uploaded")
    }

    this.logger.log(`Processing uploaded file: ${file.originalname} (${file.size} bytes)`)

    try {
      // Parse the JSON file
      const parseResult = await this.jsonParserService.parseJsonFile(file.path)

      if (!parseResult.success || parseResult.data.length === 0) {
        this.logger.error(`Failed to parse file: ${parseResult.errors.length} errors`)
        return {
          success: false,
          message: "Failed to parse JSON file",
          parseErrors: parseResult.errors,
        }
      }

      // Migrate the parsed data
      const migrationResult = await this.migrationService.migratePuzzles(parseResult.data, {
        filename: file.originalname,
        fileSize: file.size,
        uploadedBy: "admin", // user.id || 'unknown',
      })

      // Clean up uploaded file
      try {
        unlinkSync(file.path)
      } catch (cleanupError) {
        this.logger.warn(`Failed to cleanup uploaded file: ${cleanupError.message}`)
      }

      const message = `Migration completed: ${migrationResult.summary.successfulInserts} puzzles inserted, ${migrationResult.summary.duplicatesSkipped} duplicates skipped, ${migrationResult.summary.failedInserts} failed`

      this.logger.log(message)

      return {
        success: migrationResult.success,
        message,
        result: migrationResult,
      }
    } catch (error) {
      this.logger.error(`Migration failed: ${error.message}`, error.stack)

      // Clean up uploaded file on error
      try {
        unlinkSync(file.path)
      } catch (cleanupError) {
        this.logger.warn(`Failed to cleanup uploaded file after error: ${cleanupError.message}`)
      }

      throw new InternalServerErrorException("Migration process failed")
    }
  }

  @Post("parse-json")
  @ApiOperation({
    summary: "Parse JSON string without uploading file",
    description: "Parse and validate JSON puzzle data without persisting to database",
  })
  @ApiResponse({
    status: 200,
    description: "JSON parsed successfully",
  })
  async parseJsonData(body: { jsonData: string }) {
    if (!body.jsonData) {
      throw new BadRequestException("JSON data is required")
    }

    this.logger.log("Parsing JSON data from request body")

    const parseResult = await this.jsonParserService.parseJsonString(body.jsonData)

    return {
      success: parseResult.success,
      message: `Parsed ${parseResult.summary.validRecords}/${parseResult.summary.totalRecords} records successfully`,
      result: parseResult,
    }
  }

  @Get("stats")
  @ApiOperation({
    summary: "Get migration statistics",
    description: "Retrieve statistics about puzzles in the database",
  })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
  })
  async getMigrationStats() {
    this.logger.log("Retrieving migration statistics")

    const stats = await this.migrationService.getMigrationStats()

    return {
      success: true,
      message: "Statistics retrieved successfully",
      data: stats,
    }
  }

  @Get("sample")
  @ApiOperation({
    summary: "Get sample JSON structure",
    description: "Retrieve a sample JSON structure for puzzle data format",
  })
  @ApiResponse({
    status: 200,
    description: "Sample JSON structure",
  })
  getSampleJson() {
    this.logger.log("Providing sample JSON structure")

    return {
      success: true,
      message: "Sample JSON structure",
      data: this.jsonParserService.generateSampleJson(),
    }
  }

  @Post("cleanup")
  @ApiOperation({
    summary: "Cleanup old inactive puzzles",
    description: "Remove old inactive puzzles from the database",
  })
  @ApiResponse({
    status: 200,
    description: "Cleanup completed successfully",
  })
  async cleanupOldPuzzles(body: { daysOld?: number }) {
    const daysOld = body.daysOld || 30

    this.logger.log(`Starting cleanup of puzzles older than ${daysOld} days`)

    const deletedCount = await this.migrationService.cleanupOldPuzzles(daysOld)

    return {
      success: true,
      message: `Cleanup completed: ${deletedCount} puzzles removed`,
      data: { deletedCount, daysOld },
    }
  }
}
