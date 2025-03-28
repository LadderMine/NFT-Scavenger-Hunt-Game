import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Reward, RewardStatus } from "../entities/reward.entity"
import type { CreateRewardDto } from "../dto/create-reward.dto"
import type { QueryRewardsDto } from "../dto/query-rewards.dto"

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(Reward)
    private rewardsRepository: Repository<Reward>,
  ) {}

  async create(createRewardDto: CreateRewardDto): Promise<Reward> {
    const reward = this.rewardsRepository.create({
      ...createRewardDto,
      status: RewardStatus.PENDING,
    })
    return this.rewardsRepository.save(reward)
  }

  async findAll(queryParams: QueryRewardsDto): Promise<Reward[]> {
    const whereClause: any = {}

    if (queryParams.userId) {
      whereClause.userId = queryParams.userId
    }

    if (queryParams.type) {
      whereClause.type = queryParams.type
    }

    if (queryParams.status) {
      whereClause.status = queryParams.status
    }

    return this.rewardsRepository.find({ where: whereClause })
  }

  async findOne(id: string): Promise<Reward> {
    const reward = await this.rewardsRepository.findOne({ where: { id } })
    if (!reward) {
      throw new NotFoundException(`Reward with ID ${id} not found`)
    }
    return reward
  }

  async updateStatus(id: string, status: RewardStatus): Promise<Reward> {
    const reward = await this.findOne(id)
    reward.status = status
    return this.rewardsRepository.save(reward)
  }

  async findByUserId(userId: string): Promise<Reward[]> {
    return this.rewardsRepository.find({ where: { userId } })
  }
}

