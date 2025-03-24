import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { Repository } from 'typeorm';
import { UpdateCommentDto } from '../dtos/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentRepo: Repository<Comment>) {}

  async create(createCommentDto: CreateCommentDto[]) {
    try {
      const comment = this.commentRepo.create(createCommentDto);
      return await this.commentRepo.save(comment);
    } catch (error) {
      throw new InternalServerErrorException('Error creating comment');
    }
  }
  
  async findAll(postId: number) {
    try {
      const comments = await this.commentRepo.find({
        where: { post: { id: postId } } as any,
        relations: ['post'],
      });

      if (!comments.length) throw new NotFoundException('No comments found for this post');
      return comments;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving comments');
    }
  }  

  async update(id: number, dto: UpdateCommentDto) {
    try {
      const comment = await this.commentRepo.findOne({ where: { id } as any });
      if (!comment) throw new NotFoundException('Comment not found');

      Object.assign(comment, dto);
      return await this.commentRepo.save(comment);
    } catch (error) {
      throw new InternalServerErrorException('Error updating comment');
    }
  }

  async remove(id: number) {
    try {
      const comment = await this.commentRepo.findOne({ where: { id } as any });
      if (!comment) throw new NotFoundException('Comment not found');

      return await this.commentRepo.remove(comment);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting comment');
    }
  }
}
