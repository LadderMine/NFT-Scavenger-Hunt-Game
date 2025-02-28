import { IsNotEmpty, IsUUID, IsBoolean, IsOptional, IsObject } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateUserLanguageDto {
  @ApiProperty({ description: "User ID" })
  @IsNotEmpty()
  @IsUUID()
  userId: string

  @ApiProperty({ description: "Language ID" })
  @IsNotEmpty()
  @IsUUID()
  languageId: string

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

