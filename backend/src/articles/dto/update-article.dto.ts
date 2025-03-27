import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator"
import { ArticleStatus } from "../entities/article.entity"

export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string

  @IsString()
  @IsOptional()
  content?: string

  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus
}

