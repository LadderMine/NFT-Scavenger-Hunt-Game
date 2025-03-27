import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { FindOptionsWhere, Repository } from "typeorm"
import { Article } from "./entities/article.entity"
import type { CreateArticleDto } from "./dto/create-article.dto"
import type { UpdateArticleDto } from "./dto/update-article.dto"
import type { FilterArticlesDto } from "./dto/filter-articles.dto"

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articlesRepository.create(createArticleDto)
    return this.articlesRepository.save(article)
  }

  async findAll(filterDto: FilterArticlesDto): Promise<[Article[], number]> {
    const { authorId, status, createdAfter, createdBefore, page = 1, limit = 10 } = filterDto
    const skip = (page - 1) * limit

    const where: FindOptionsWhere<Article> = {}

    if (authorId) {
      where.authorId = authorId
    }

    if (status) {
      where.status = status
    }

    if (createdAfter || createdBefore) {
      where.createdAt = {}

      if (createdAfter) {
        where.createdAt = {
          ...where.createdAt,
          gte: new Date(createdAfter),
        }
      }

      if (createdBefore) {
        where.createdAt = {
          ...where.createdAt,
          lte: new Date(createdBefore),
        }
      }
    }

    return this.articlesRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: "DESC" },
    })
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({ where: { id } })

    if (!article) {
      throw new NotFoundException(`Article with ID "${id}" not found`)
    }

    return article
  }

  async update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.findOne(id)

    Object.assign(article, updateArticleDto)

    return this.articlesRepository.save(article)
  }

  async remove(id: string): Promise<void> {
    const result = await this.articlesRepository.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException(`Article with ID "${id}" not found`)
    }
  }
}

