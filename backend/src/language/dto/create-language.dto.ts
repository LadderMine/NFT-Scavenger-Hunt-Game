import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsObject, MaxLength } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateLanguageDto {
  @ApiProperty({ description: "Language code (e.g., en, es, fr)" })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  code: string

  @ApiProperty({ description: "Language name in English (e.g., English, Spanish, French)" })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string

  @ApiPropertyOptional({ description: "Language name in its native form (e.g., English, Español, Français)" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nativeName?: string

  @ApiPropertyOptional({ description: "Whether this is the default language" })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean

  @ApiPropertyOptional({ description: "Whether this language is active" })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @ApiPropertyOptional({ description: "URL or identifier for the language flag icon" })
  @IsOptional()
  @IsString()
  flagIcon?: string

  @ApiPropertyOptional({ description: "Description of the language" })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: "Sort order for display" })
  @IsOptional()
  @IsNumber()
  sortOrder?: number

  @ApiPropertyOptional({ description: "Additional metadata" })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>
}

