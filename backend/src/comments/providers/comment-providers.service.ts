import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { Repository } from 'typeorm';
import { UpdateCommentDto } from '../dtos/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentRepo: Repository<Comment>) {}

  async create(createCommentDto: CreateCommentDto[]) {
    const comment = this.commentRepo.create(createCommentDto);
    return this.commentRepo.save(comment);
  }
  
  async findAll(postId: number) {
    return this.commentRepo.find({
      where: { post: { id: postId } } as any,
      relations: ['post'],
    });
  }  

  async update(id: number, dto: UpdateCommentDto) {
    const comment = await this.commentRepo.findOne({ where: { id } as any });
    if (!comment) throw new NotFoundException('Comment not found');

    Object.assign(comment, dto);
    return this.commentRepo.save(comment);
  }

  async remove(id: number) {
    const comment = await this.commentRepo.findOne({ where: { id } as any });
    if (!comment) throw new NotFoundException('Comment not found');

    return this.commentRepo.remove(comment);
  }
}
