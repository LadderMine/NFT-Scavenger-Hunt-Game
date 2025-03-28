import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Referral, ReferralStatus } from "../entities/referral.entity"
import type { CreateReferralDto } from "../dto/create-referral.dto"
import type { UpdateReferralDto } from "../dto/update-referral.dto"
import type { EventEmitter2 } from "@nestjs/event-emitter"

@Injectable()
export class ReferralsService {
  constructor(
    @InjectRepository(Referral)
    private referralsRepository: Repository<Referral>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createReferralDto: CreateReferralDto): Promise<Referral> {
    const referral = this.referralsRepository.create(createReferralDto)
    return this.referralsRepository.save(referral)
  }

  async findOne(id: string): Promise<Referral> {
    const referral = await this.referralsRepository.findOne({ where: { id } })
    if (!referral) {
      throw new NotFoundException(`Referral with ID ${id} not found`)
    }
    return referral
  }

  async update(id: string, updateReferralDto: UpdateReferralDto): Promise<Referral> {
    const referral = await this.findOne(id)

    // Update the referral
    Object.assign(referral, updateReferralDto)
    const updatedReferral = await this.referralsRepository.save(referral)

    // If the referral is completed, emit an event to trigger reward processing
    if (updateReferralDto.status === ReferralStatus.COMPLETED) {
      this.eventEmitter.emit("referral.completed", updatedReferral)
    }

    return updatedReferral
  }

  async findByReferrerId(referrerId: string): Promise<Referral[]> {
    return this.referralsRepository.find({ where: { referrerId } })
  }

  async findByReferredId(referredId: string): Promise<Referral[]> {
    return this.referralsRepository.find({ where: { referredId } })
  }
}

