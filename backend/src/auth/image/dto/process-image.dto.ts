import { IsEnum, IsNumber, IsOptional, IsString, IsBoolean, Min, Max, ValidateNested, IsArray } from "class-validator"
import { Type } from "class-transformer"
import { ImageFormat } from "../entities/image.entity"

export class ResizeOptionsDto {
  @IsNumber()
  @IsOptional()
  width?: number

  @IsNumber()
  @IsOptional()
  height?: number

  @IsBoolean()
  @IsOptional()
  fit?: boolean

  @IsBoolean()
  @IsOptional()
  withoutEnlargement?: boolean
}

export class CropOptionsDto {
  @IsNumber()
  left: number

  @IsNumber()
  top: number

  @IsNumber()
  width: number

  @IsNumber()
  height: number
}

export class OptimizeOptionsDto {
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  quality?: number

  @IsBoolean()
  @IsOptional()
  progressive?: boolean

  @IsBoolean()
  @IsOptional()
  withMetadata?: boolean
}

export class ProcessImageDto {
  @IsString()
  imageId: string

  @IsEnum(ImageFormat)
  @IsOptional()
  outputFormat?: ImageFormat

  @IsOptional()
  @ValidateNested()
  @Type(() => ResizeOptionsDto)
  resize?: ResizeOptionsDto

  @IsOptional()
  @ValidateNested()
  @Type(() => CropOptionsDto)
  crop?: CropOptionsDto

  @IsOptional()
  @ValidateNested()
  @Type(() => OptimizeOptionsDto)
  optimize?: OptimizeOptionsDto

  @IsString()
  @IsOptional()
  variantName?: string

  @IsBoolean()
  @IsOptional()
  replaceOriginal?: boolean
}

export class BatchProcessImageDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcessImageDto)
  operations: ProcessImageDto[]
}

