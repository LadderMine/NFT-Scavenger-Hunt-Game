import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString, IsOptional, IsBoolean, IsEnum, IsUUID, Min, Max } from "class-validator"
import { TargetType } from "../entities/feedback.entity"

export class CreateFeedbackDto {
  @ApiProperty({
    description: "Rating from 1 to 5",
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number

  @ApiProperty({
    description: "Optional feedback comment",
    required: false,
    example: "Great puzzle! Really enjoyed solving it.",
  })
  @IsOptional()
  @IsString()
  comment?: string

  @ApiProperty({
    description: "Type of content being reviewed",
    enum: TargetType,
    example: TargetType.PUZZLE,
  })
  @IsEnum(TargetType)
  targetType: TargetType

  @ApiProperty({
    description: "Optional ID of specific content being reviewed",
    required: false,
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsOptional()
  @IsUUID()
  targetId?: string

  @ApiProperty({
    description: "Whether to submit feedback anonymously",
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean

  @ApiProperty({
    description: "Optional metadata (device info, app version, etc.)",
    required: false,
    example: {
      appVersion: "1.0.0",
      deviceInfo: "iPhone 12",
      userAgent: "Mozilla/5.0...",
    },
  })
  @IsOptional()
  metadata?: {
    userAgent?: string
    deviceInfo?: string
    appVersion?: string
    [key: string]: any
  }
}

export class UpdateFeedbackDto {
  @ApiProperty({
    description: "Mark feedback as resolved/unresolved",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isResolved?: boolean

  @ApiProperty({
    description: "Admin notes about the feedback",
    required: false,
  })
  @IsOptional()
  @IsString()
  adminNotes?: string
}

export class FeedbackQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(TargetType)
  targetType?: TargetType

  @ApiProperty({ required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isResolved?: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  userId?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  targetId?: string
}
