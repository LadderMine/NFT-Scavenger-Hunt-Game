import { IsEnum, IsNumber, IsOptional, IsString, IsBoolean } from "class-validator"
import { ImageFormat, ProcessingStatus } from "../entities/image.entity"

export class CreateImageDto {
  @IsString()
  filename: string

  @IsString()
  originalName: string

  @IsString()
  mimeType: string

  @IsEnum(ImageFormat)
  format: ImageFormat

  @IsNumber()
  size: number

  @IsNumber()
  width: number

  @IsNumber()
  height: number

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  path: string

  @IsString()
  @IsOptional()
  publicUrl?: string

  @IsEnum(ProcessingStatus)
  @IsOptional()
  status?: ProcessingStatus

  @IsOptional()
  metadata?: Record<string, any>

  @IsOptional()
  processingOptions?: Record<string, any>

  @IsOptional()
  variants?: Record<string, any>[]

  @IsBoolean()
  @IsOptional()
  isOptimized?: boolean

  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}

