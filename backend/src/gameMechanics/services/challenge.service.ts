import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { type Repository, MoreThan, LessThan } from "typeorm"
import { type Challenge, ChallengeStatus } from "../entities/challenge.entity"
import type { CreateChallengeDto } from "../dto/create-challenge.dto"
import type { UpdateChallengeDto } from "../dto/update-challenge.dto"

@Injectable()
export class ChallengeService {
  constructor(private challengeRepository: Repository<Challenge>) {}

  async create(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    const challenge = this.challengeRepository.create({
      ...createChallengeDto,
      unlockTime: createChallengeDto.unlockTime ? new Date(createChallengeDto.unlockTime) : null,
      expiryTime: createChallengeDto.expiryTime ? new Date(createChallengeDto.expiryTime) : null,
    })

    return this.challengeRepository.save(challenge)
  }

  async findAll(): Promise<Challenge[]> {
    return this.challengeRepository.find({
      order: { order: "ASC", createdAt: "DESC" },
    })
  }

  async findActive(): Promise<Challenge[]> {
    const now = new Date()
    return this.challengeRepository.find({
      where: {
        status: ChallengeStatus.ACTIVE,
        unlockTime: LessThan(now),
      },
      order: { order: "ASC" },
    })
  }

  async findAvailableForUser(): Promise<Challenge[]> {
    const now = new Date()
    return this.challengeRepository.find({
      where: [
        {
          status: ChallengeStatus.ACTIVE,
          unlockTime: LessThan(now),
          expiryTime: MoreThan(now),
        },
        {
          status: ChallengeStatus.ACTIVE,
          unlockTime: LessThan(now),
          expiryTime: null,
        },
      ],
      order: { order: "ASC" },
    })
  }

  async findOne(id: string): Promise<Challenge> {
    const challenge = await this.challengeRepository.findOne({
      where: { id },
    })

    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found`)
    }

    return challenge
  }

  async findOneForUser(id: string): Promise<Challenge> {
    const now = new Date()
    const challenge = await this.challengeRepository.findOne({
      where: {
        id,
        status: ChallengeStatus.ACTIVE,
        unlockTime: LessThan(now),
      },
    })

    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found or not available`)
    }

    if (challenge.expiryTime && challenge.expiryTime < now) {
      throw new BadRequestException("Challenge has expired")
    }

    return challenge
  }

  async update(id: string, updateChallengeDto: UpdateChallengeDto): Promise<Challenge> {
    const challenge = await this.findOne(id)

    const updateData = {
      ...updateChallengeDto,
      unlockTime: updateChallengeDto.unlockTime ? new Date(updateChallengeDto.unlockTime) : challenge.unlockTime,
      expiryTime: updateChallengeDto.expiryTime ? new Date(updateChallengeDto.expiryTime) : challenge.expiryTime,
    }

    await this.challengeRepository.update(id, updateData)
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    const challenge = await this.findOne(id)
    await this.challengeRepository.remove(challenge)
  }

  async getDailyChallenge(): Promise<Challenge | null> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return this.challengeRepository.findOne({
      where: {
        status: ChallengeStatus.ACTIVE,
        unlockTime: MoreThan(today),
        unlockTime: LessThan(tomorrow),
      },
    })
  }

  async getWeeklyChallenge(): Promise<Challenge | null> {
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(endOfWeek.getDate() + 7)

    return this.challengeRepository.findOne({
      where: {
        status: ChallengeStatus.ACTIVE,
        unlockTime: MoreThan(startOfWeek),
        unlockTime: LessThan(endOfWeek),
        metadata: { type: "weekly" },
      },
    })
  }
}
