import { Injectable, Logger } from "@nestjs/common"
import { readFileSync } from "fs"
import type { PuzzleData, ParseResult, ParseError } from "../interfaces/puzzle.interface"

@Injectable()
export class JsonParserService {
  private readonly logger = new Logger(JsonParserService.name)

  /**
   * Parse JSON file and validate puzzle data
   */
  async parseJsonFile(filePath: string): Promise<ParseResult> {
    this.logger.log(`Starting to parse JSON file: ${filePath}`)

    try {
      const fileContent = readFileSync(filePath, "utf-8")
      const jsonData = JSON.parse(fileContent)

      return this.validateAndParseData(jsonData)
    } catch (error) {
      this.logger.error(`Failed to parse JSON file: ${error.message}`)
      return {
        success: false,
        errors: [
          {
            index: -1,
            message: `File parsing error: ${error.message}`,
          },
        ],
        summary: {
          totalRecords: 0,
          validRecords: 0,
          invalidRecords: 0,
        },
      }
    }
  }

  /**
   * Parse JSON string and validate puzzle data
   */
  async parseJsonString(jsonString: string): Promise<ParseResult> {
    try {
      const jsonData = JSON.parse(jsonString)
      return this.validateAndParseData(jsonData)
    } catch (error) {
      this.logger.error(`Failed to parse JSON string: ${error.message}`)
      return {
        success: false,
        errors: [
          {
            index: -1,
            message: `JSON parsing error: ${error.message}`,
          },
        ],
        summary: {
          totalRecords: 0,
          validRecords: 0,
          invalidRecords: 0,
        },
      }
    }
  }

  /**
   * Validate and parse the JSON data structure
   */
  private validateAndParseData(jsonData: any): ParseResult {
    const errors: ParseError[] = []
    const validPuzzles: PuzzleData[] = []

    // Handle both single object and array of objects
    const puzzleArray = Array.isArray(jsonData) ? jsonData : [jsonData]

    puzzleArray.forEach((item, index) => {
      const validationErrors = this.validatePuzzleData(item, index)

      if (validationErrors.length === 0) {
        validPuzzles.push(this.normalizePuzzleData(item))
      } else {
        errors.push(...validationErrors)
      }
    })

    const result: ParseResult = {
      success: errors.length === 0,
      data: validPuzzles,
      errors,
      summary: {
        totalRecords: puzzleArray.length,
        validRecords: validPuzzles.length,
        invalidRecords: errors.length,
      },
    }

    this.logger.log(`Parsing completed: ${result.summary.validRecords}/${result.summary.totalRecords} records valid`)

    return result
  }

  /**
   * Validate individual puzzle data
   */
  private validatePuzzleData(data: any, index: number): ParseError[] {
    const errors: ParseError[] = []

    // Required fields validation
    if (!data.title || typeof data.title !== "string") {
      errors.push({
        index,
        field: "title",
        message: "Title is required and must be a string",
        data,
      })
    }

    if (!data.difficulty || !["easy", "medium", "hard", "expert"].includes(data.difficulty)) {
      errors.push({
        index,
        field: "difficulty",
        message: "Difficulty must be one of: easy, medium, hard, expert",
        data,
      })
    }

    if (!data.category || typeof data.category !== "string") {
      errors.push({
        index,
        field: "category",
        message: "Category is required and must be a string",
        data,
      })
    }

    // Content validation
    if (!data.content || typeof data.content !== "object") {
      errors.push({
        index,
        field: "content",
        message: "Content is required and must be an object",
        data,
      })
    } else {
      if (!data.content.question || typeof data.content.question !== "string") {
        errors.push({
          index,
          field: "content.question",
          message: "Content question is required and must be a string",
          data,
        })
      }

      if (!data.content.answer || typeof data.content.answer !== "string") {
        errors.push({
          index,
          field: "content.answer",
          message: "Content answer is required and must be a string",
          data,
        })
      }

      if (!data.content.type || !["text", "multiple_choice", "code", "math", "logic"].includes(data.content.type)) {
        errors.push({
          index,
          field: "content.type",
          message: "Content type must be one of: text, multiple_choice, code, math, logic",
          data,
        })
      }
    }

    // Optional fields validation
    if (data.tags && !Array.isArray(data.tags)) {
      errors.push({
        index,
        field: "tags",
        message: "Tags must be an array of strings",
        data,
      })
    }

    return errors
  }

  /**
   * Normalize puzzle data to ensure consistent structure
   */
  private normalizePuzzleData(data: any): PuzzleData {
    return {
      title: data.title.trim(),
      description: data.description?.trim() || null,
      difficulty: data.difficulty,
      category: data.category.trim(),
      content: {
        question: data.content.question.trim(),
        answer: data.content.answer.trim(),
        hints: data.content.hints || [],
        explanation: data.content.explanation?.trim() || null,
        options: data.content.options || [],
        type: data.content.type,
      },
      metadata: data.metadata || {},
      tags: data.tags || [],
      isActive: data.isActive !== undefined ? data.isActive : true,
    }
  }

  /**
   * Generate sample JSON structure for documentation
   */
  generateSampleJson(): object {
    return {
      puzzles: [
        {
          title: "Sample Logic Puzzle",
          description: "A sample puzzle for demonstration",
          difficulty: "medium",
          category: "logic",
          content: {
            question: "What comes next in the sequence: 2, 4, 8, 16, ?",
            answer: "32",
            hints: ["Look for a pattern", "Each number is doubled"],
            explanation: "This is a geometric sequence where each number is multiplied by 2",
            type: "text",
          },
          metadata: {
            author: "System",
            source: "Sample Data",
            estimatedTime: 5,
            points: 10,
          },
          tags: ["sequence", "pattern", "math"],
          isActive: true,
        },
      ],
    }
  }
}
