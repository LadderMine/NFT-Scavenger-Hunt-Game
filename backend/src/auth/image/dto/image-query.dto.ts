import { IsEnum, IsOptional, IsInt, Min, IsBoolean, Transform } from "class-validator"
import { Type } from "class-transformer"
import { ImageFormat, ProcessingStatus } from "../entities/image.entity"

export class ImageQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number

  @IsOptional()
  @IsEnum(ImageFormat)
  format?: ImageFormat

  @IsOptional()
  @IsEnum(ProcessingStatus)
  status?: ProcessingStatus

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === "true") return true
    if (value === "false") return false
    return value
  })
  isOptimized?: boolean
}

