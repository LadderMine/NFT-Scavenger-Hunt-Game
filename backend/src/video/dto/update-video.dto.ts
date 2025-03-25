import { PartialType } from "@nestjs/mapped-types"
import { CreateVideoDto } from "./create-video.dto"
import { IsOptional, IsNumber } from "class-validator"

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
  @IsOptional()
  @IsNumber()
  duration?: number
}

