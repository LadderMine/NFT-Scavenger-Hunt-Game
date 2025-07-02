import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Reaction } from "./entities/reaction.entity"
import type { CreateReactionDto } from "./dto/create-reaction.dto"
import type { UpdateReactionDto } from "./dto/update-reaction.dto"
import type { ReactionAggregationDto } from "./dto/reaction-aggregation.dto"

@Injectable()
export class UserReactionService {
  private readonly allowedEmojis = ["👍", "👎", "❤️", "😂", "😮", "😢", "😡", "🤔", "🎉", "🔥"];

  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
  ) {}

  /**
   * Validate if the provided emoji is allowed
   */
  private validateEmoji(emoji: string): boolean {
    return this.allowedEmojis.includes(emoji)
  }

  /**
   * Create a new reaction or update existing one
   */
  async createReaction(createReactionDto: CreateReactionDto): Promise<Reaction> {
    if (!this.validateEmoji(createReactionDto.emoji)) {
      throw new BadRequestException(`Invalid emoji. Allowed emojis: ${this.allowedEmojis.join(", ")}`)
    }

    // Check if user already reacted to this content
    const existingReaction = await this.reactionRepository.findOne({
      where: {
        userId: createReactionDto.userId,
        contentId: createReactionDto.contentId,
      },
    })

    if (existingReaction) {
      // Update existing reaction
      existingReaction.emoji = createReactionDto.emoji
      existingReaction.updatedAt = new Date()
      return await this.reactionRepository.save(existingReaction)
    }

    // Create new reaction
    const reaction = this.reactionRepository.create(createReactionDto)
    return await this.reactionRepository.save(reaction)
  }

  /**
   * Get all reactions for a specific content
   */
  async getReactionsByContent(contentId: string): Promise<Reaction[]> {
    return await this.reactionRepository.find({
      where: { contentId },
      order: { createdAt: "DESC" },
    })
  }

  /**
   * Get all reactions by a specific user
   */
  async getReactionsByUser(userId: string): Promise<Reaction[]> {
    return await this.reactionRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    })
  }

  /**
   * Get a specific reaction by user and content
   */
  async getReactionByUserAndContent(userId: string, contentId: string): Promise<Reaction | null> {
    return await this.reactionRepository.findOne({
      where: { userId, contentId },
    })
  }

  /**
   * Update a reaction
   */
  async updateReaction(id: string, updateReactionDto: UpdateReactionDto): Promise<Reaction> {
    const reaction = await this.reactionRepository.findOne({ where: { id } })

    if (!reaction) {
      throw new NotFoundException("Reaction not found")
    }

    if (updateReactionDto.emoji && !this.validateEmoji(updateReactionDto.emoji)) {
      throw new BadRequestException(`Invalid emoji. Allowed emojis: ${this.allowedEmojis.join(", ")}`)
    }

    Object.assign(reaction, updateReactionDto)
    reaction.updatedAt = new Date()

    return await this.reactionRepository.save(reaction)
  }

  /**
   * Remove a reaction
   */
  async removeReaction(id: string): Promise<void> {
    const result = await this.reactionRepository.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException("Reaction not found")
    }
  }

  /**
   * Remove reaction by user and content
   */
  async removeReactionByUserAndContent(userId: string, contentId: string): Promise<void> {
    const result = await this.reactionRepository.delete({ userId, contentId })

    if (result.affected === 0) {
      throw new NotFoundException("Reaction not found")
    }
  }

  /**
   * Get aggregated reaction counts for a specific content
   */
  async getReactionAggregation(contentId: string): Promise<ReactionAggregationDto> {
    const reactions = await this.reactionRepository
      .createQueryBuilder("reaction")
      .select("reaction.emoji", "emoji")
      .addSelect("COUNT(*)", "count")
      .where("reaction.contentId = :contentId", { contentId })
      .groupBy("reaction.emoji")
      .getRawMany()

    const reactionCounts: Record<string, number> = {}
    let totalReactions = 0

    reactions.forEach((reaction) => {
      const count = Number.parseInt(reaction.count, 10)
      reactionCounts[reaction.emoji] = count
      totalReactions += count
    })

    return {
      contentId,
      reactions: reactionCounts,
      totalReactions,
    }
  }

  /**
   * Get aggregated reaction counts for multiple contents
   */
  async getMultipleReactionAggregations(contentIds: string[]): Promise<ReactionAggregationDto[]> {
    if (contentIds.length === 0) {
      return []
    }

    const reactions = await this.reactionRepository
      .createQueryBuilder("reaction")
      .select("reaction.contentId", "contentId")
      .addSelect("reaction.emoji", "emoji")
      .addSelect("COUNT(*)", "count")
      .where("reaction.contentId IN (:...contentIds)", { contentIds })
      .groupBy("reaction.contentId, reaction.emoji")
      .getRawMany()

    const aggregationMap = new Map<string, ReactionAggregationDto>()

    // Initialize all content IDs
    contentIds.forEach((contentId) => {
      aggregationMap.set(contentId, {
        contentId,
        reactions: {},
        totalReactions: 0,
      })
    })

    // Populate with actual data
    reactions.forEach((reaction) => {
      const contentId = reaction.contentId
      const emoji = reaction.emoji
      const count = Number.parseInt(reaction.count, 10)

      const aggregation = aggregationMap.get(contentId)!
      aggregation.reactions[emoji] = count
      aggregation.totalReactions += count
    })

    return Array.from(aggregationMap.values())
  }

  /**
   * Get allowed emojis list
   */
  getAllowedEmojis(): string[] {
    return [...this.allowedEmojis]
  }
}
