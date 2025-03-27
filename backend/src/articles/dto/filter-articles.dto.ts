import { IsDateString, IsEnum, IsOptional, IsUUID } from "class-validator"
import { ArticleStatus } from "../entities/article.entity"
import { Type } from "class-transformer"

export class FilterArticlesDto {
  @IsOptional()
  @IsUUID()
  authorId?: string

  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus

  @IsOptional()
  @IsDateString()
  createdAfter?: string

  @IsOptional()
  @IsDateString()
  createdBefore?: string

  @IsOptional()
  @Type(() => Number)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10
}

