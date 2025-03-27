import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from "@nestjs/common"
import type { ArticlesService } from "./articles.service"
import type { CreateArticleDto } from "./dto/create-article.dto"
import type { UpdateArticleDto } from "./dto/update-article.dto"
import type { FilterArticlesDto } from "./dto/filter-articles.dto"
import { AdminGuard } from "./guards/admin.guard"

@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  async findAll(@Query() filterDto: FilterArticlesDto) {
    const [articles, total] = await this.articlesService.findAll(filterDto);
    const { page = 1, limit = 10 } = filterDto;
    
    return {
      data: articles,
      meta: {
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / +limit),
      },
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch(":id")
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto)
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}

