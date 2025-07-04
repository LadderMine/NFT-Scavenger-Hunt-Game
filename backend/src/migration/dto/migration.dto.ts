import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsOptional, IsNumber, Min } from "class-validator"
import type { Express } from "express"

export class ParseJsonDto {
  @ApiProperty({
    description: "JSON string containing puzzle data",
    example: '{"puzzles": [{"title": "Sample Puzzle", "difficulty": "easy", ...}]}',
  })
  @IsString()
  jsonData: string
}

export class CleanupDto {
  @ApiProperty({
    description: "Number of days old for cleanup threshold",
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  daysOld?: number
}

export class UploadFileDto {
  @ApiProperty({
    type: "string",
    format: "binary",
    description: "JSON file containing puzzle data",
  })
  file: Express.Multer.File
}
