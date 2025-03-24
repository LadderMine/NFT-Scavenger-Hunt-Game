import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateReactionDto } from '../dtos/create-reaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from '../reactions.entity';

@Injectable()
export class ReactionsService {
    constructor(@InjectRepository(Reaction) 
    private reactionRepo: Repository<Reaction>) {}

  async addReaction(createReactionDto: CreateReactionDto) {
    try {
      const existingReaction = await this.reactionRepo.findOne({
        where: { 
          postId: createReactionDto.postId, 
          userId: createReactionDto.userId, 
          reactionType: createReactionDto.reactionType 
        } as any,
      });

      if (existingReaction) return existingReaction;

      const reaction = this.reactionRepo.create(createReactionDto);
      return await this.reactionRepo.save(reaction);
    } catch (error) {
      throw new InternalServerErrorException('Error adding reaction');
    }
  }

  async removeReaction(postId: number, userId: number) {
    try {
      const reaction = await this.reactionRepo.findOne({ where: { postId, userId } as any });
      if (!reaction) throw new NotFoundException('Reaction not found');

      return await this.reactionRepo.remove(reaction);
    } catch (error) {
      throw new InternalServerErrorException('Error removing reaction');
    }
  }
}
