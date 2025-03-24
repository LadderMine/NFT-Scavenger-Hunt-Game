import { IsOptional, IsUUID, IsBoolean, IsObject } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"

export class UpdateUserLanguageDto {
  @ApiPropertyOptional({ description: "Language ID" })
  @IsOptional()
  @IsUUID()
  languageId?: string

  @ApiPropertyOptional({ description: "Whether the language was auto-detected" })
  @IsOptional()
  @IsBoolean()
  autoDetected?: boolean

  @ApiPropertyOptional({ description: "Additional language preferences" })
  @IsOptional()
  @IsObject()
  additionalPreferences?: Record<string, any>

  @ApiPropertyOptional({ description: "Additional metadata" })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>
}

