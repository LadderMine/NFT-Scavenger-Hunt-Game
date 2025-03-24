import { IsOptional, IsEnum, IsString, IsUUID } from "class-validator"
import { VideoStatus, VideoVisibility } from "../entities/video.entity"

export class VideoQueryDto {
  @IsOptional()
  @IsUUID()
  userId?: string

  @IsOptional()
  @IsEnum(VideoStatus)
  status?: VideoStatus

  @IsOptional()
  @IsEnum(VideoVisibility)
  visibility?: VideoVisibility

  @IsOptional()
  @IsString()
  search?: string
}

