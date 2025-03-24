import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReactionDto } from '../dtos/create-reaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from '../reactions.entity';

@Injectable()
export class ReactionsService {
    constructor(@InjectRepository(Reaction) 
    private reactionRepo: Repository<Reaction>) {}

  async addReaction(createReactionDto: CreateReactionDto) {
    const existingReaction = await this.reactionRepo.findOne({
      where: { postId: createReactionDto.postId, userId: createReactionDto.userId, reactionType: createReactionDto.reactionType } as any,
    });

    if (existingReaction) return existingReaction;

    const reaction = this.reactionRepo.create(createReactionDto);
    return this.reactionRepo.save(reaction);
  }

  async removeReaction(postId: number, userId: number) {
    const reaction = await this.reactionRepo.findOne({ where: { postId, userId } as any });
    if (!reaction) throw new NotFoundException('Reaction not found');

    return this.reactionRepo.remove(reaction);
  }
}
