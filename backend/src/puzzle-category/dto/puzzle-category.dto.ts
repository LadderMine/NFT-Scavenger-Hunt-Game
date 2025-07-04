import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsArray, Min, MaxLength, IsUUID } from "class-validator"

export class CreateCategoryDto {
  @ApiProperty({ description: "Name of the category" })
  @IsString()
  @MaxLength(100)
  name: string

  @ApiProperty({ description: "Description of the category", required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ description: "Slug for URL-friendly category names" })
  @IsString()
  @MaxLength(100)
  slug: string

  @ApiProperty({ description: "Icon or emoji for the category", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  icon?: string

  @ApiProperty({ description: "Color code for the category", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  color?: string

  @ApiProperty({ description: "Order for sorting categories", required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number
}

export class UpdateCategoryDto {
  @ApiProperty({ description: "Name of the category", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string

  @ApiProperty({ description: "Description of the category", required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ description: "Slug for URL-friendly category names", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string

  @ApiProperty({ description: "Icon or emoji for the category", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  icon?: string

  @ApiProperty({ description: "Color code for the category", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  color?: string

  @ApiProperty({ description: "Whether the category is active", required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @ApiProperty({ description: "Order for sorting categories", required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number
}

export class CreatePuzzleDto {
  @ApiProperty({ description: "Title of the puzzle" })
  @IsString()
  @MaxLength(200)
  title: string

  @ApiProperty({ description: "Description of the puzzle" })
  @IsString()
  description: string

  @ApiProperty({ description: "Difficulty level of the puzzle" })
  @IsEnum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"])
  difficulty: string

  @ApiProperty({ description: "Points awarded for completing the puzzle", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  points?: number

  @ApiProperty({ description: "Estimated time to complete in minutes", required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  estimatedTime?: number

  @ApiProperty({ description: "Array of category IDs", required: false })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true }) // Changed to UUID validation
  categoryIds?: string[]
}

export class UpdatePuzzleDto {
  @ApiProperty({ description: "Title of the puzzle", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string

  @ApiProperty({ description: "Description of the puzzle", required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ description: "Difficulty level of the puzzle", required: false })
  @IsOptional()
  @IsEnum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"])
  difficulty?: string

  @ApiProperty({ description: "Points awarded for completing the puzzle", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  points?: number

  @ApiProperty({ description: "Whether the puzzle is active", required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @ApiProperty({ description: "Estimated time to complete in minutes", required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  estimatedTime?: number

  @ApiProperty({ description: "Array of category IDs", required: false })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true }) // Changed to UUID validation
  categoryIds?: string[]
}

export class PuzzleResponseDto {
  @ApiProperty()
  id: string // Changed to string

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string

  @ApiProperty()
  difficulty: string

  @ApiProperty()
  points: number

  @ApiProperty()
  isActive: boolean

  @ApiProperty()
  estimatedTime: number

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

export class CategoryResponseDto {
  @ApiProperty()
  id: string // Changed to string

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string

  @ApiProperty()
  slug: string

  @ApiProperty()
  icon: string

  @ApiProperty()
  color: string

  @ApiProperty()
  isActive: boolean

  @ApiProperty()
  sortOrder: number

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty({ type: [PuzzleResponseDto] })
  puzzles: PuzzleResponseDto[]
}

export class PuzzlesByCategoryResponseDto {
  @ApiProperty()
  id: string // Changed to string

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string

  @ApiProperty()
  slug: string

  @ApiProperty()
  icon: string

  @ApiProperty()
  color: string

  @ApiProperty()
  sortOrder: number

  @ApiProperty({ type: [PuzzleResponseDto] })
  puzzles: PuzzleResponseDto[]

  @ApiProperty()
  puzzleCount: number
}
