import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString, IsInt, Min, Max } from "class-validator"
import { Type } from "class-transformer"

export class LeaderboardQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ default: 50, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50

  @ApiPropertyOptional({ description: "Filter by country code (e.g., US, UK, CA)" })
  @IsOptional()
  @IsString()
  country?: string
}
