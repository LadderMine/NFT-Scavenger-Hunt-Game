import { IsNotEmpty, IsString, IsOptional, IsEnum, IsUUID, ValidateIf } from "class-validator"
import { VideoVisibility } from "../entities/video.entity"

export class CreateVideoDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsEnum(VideoVisibility)
  visibility?: VideoVisibility

  @IsOptional()
  @IsUUID()
  @ValidateIf((o) => o.userId !== undefined)
  userId?: string
}

