import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReactionDto } from '../dtos/create-reaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReactionsService {
    constructor(@InjectRepository(Reaction) 
    private reactionRepo: Repository<Reaction>) {}

  async addReaction(dto: CreateReactionDto) {
    const existingReaction = await this.reactionRepo.findOne({
      where: { postId: dto.postId, userId: dto.userId, reactionType: dto.reactionType },
    });

    if (existingReaction) return existingReaction;

    const reaction = this.reactionRepo.create(dto);
    return this.reactionRepo.save(reaction);
  }

  async removeReaction(postId: number, userId: number) {
    const reaction = await this.reactionRepo.findOne({ where: { postId, userId } });
    if (!reaction) throw new NotFoundException('Reaction not found');

    return this.reactionRepo.remove(reaction);
  }
}
