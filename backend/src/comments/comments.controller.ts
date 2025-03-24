import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentsService } from './providers/comment-providers.service';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto[]) {
    return this.commentsService.create(createCommentDto);
  }

  @Get(':postId')
  findAll(@Param('postId') postId: number) {
    return this.commentsService.findAll(postId);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentsService.remove(id);
  }
}