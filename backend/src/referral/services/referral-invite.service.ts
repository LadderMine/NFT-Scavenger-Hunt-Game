import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { ReferralInvite, InviteStatus } from "../entities/referral-invite.entity"
import type { CreateInviteDto } from "../dto/create-invite.dto"
import type { ReferralCodeService } from "./referral-code.service"

@Injectable()
export class ReferralInviteService {
  constructor(
    private readonly inviteRepository: Repository<ReferralInvite>,
    private readonly referralCodeService: ReferralCodeService,
  ) {}

  async createInvite(createDto: CreateInviteDto): Promise<ReferralInvite> {
    // Validate referral code
    const referralCode = await this.referralCodeService.findByCode(createDto.referralCode)

    // Check if email already invited by this referral code
    const existingInvite = await this.inviteRepository.findOne({
      where: {
        referralCodeId: referralCode.id,
        email: createDto.email,
        status: InviteStatus.PENDING,
      },
    })

    if (existingInvite) {
      throw new ConflictException("Email already invited with this referral code")
    }

    const invite = this.inviteRepository.create({
      referralCodeId: referralCode.id,
      email: createDto.email,
      expiresAt: createDto.expiresAt ? new Date(createDto.expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      metadata: createDto.metadata ? JSON.stringify(createDto.metadata) : null,
    })

    const savedInvite = await this.inviteRepository.save(invite)

    // Update referral code stats
    await this.referralCodeService.updateStats(referralCode.id, { invites: 1 })

    return savedInvite
  }

  async markAsRegistered(email: string, userId: string): Promise<ReferralInvite | null> {
    const invite = await this.inviteRepository.findOne({
      where: {
        email,
        status: InviteStatus.PENDING,
      },
      relations: ["referralCode"],
    })

    if (!invite) {
      return null
    }

    // Check if not expired
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      await this.inviteRepository.update(invite.id, { status: InviteStatus.EXPIRED })
      return null
    }

    invite.invitedUserId = userId
    invite.status = InviteStatus.REGISTERED
    invite.registeredAt = new Date()

    return this.inviteRepository.save(invite)
  }

  async markAsCompleted(inviteId: string): Promise<ReferralInvite> {
    const invite = await this.inviteRepository.findOne({
      where: { id: inviteId },
      relations: ["referralCode"],
    })

    if (!invite) {
      throw new NotFoundException("Invite not found")
    }

    if (invite.status !== InviteStatus.REGISTERED) {
      throw new ConflictException("Invite must be in registered status to complete")
    }

    invite.status = InviteStatus.COMPLETED
    invite.completedAt = new Date()

    const savedInvite = await this.inviteRepository.save(invite)

    // Update referral code stats
    await this.referralCodeService.updateStats(invite.referralCodeId, { successful: 1 })

    return savedInvite
  }

  async findByReferralCode(referralCodeId: string): Promise<ReferralInvite[]> {
    return this.inviteRepository.find({
      where: { referralCodeId },
      relations: ["invitedUser"],
      order: { createdAt: "DESC" },
    })
  }

  async findByEmail(email: string): Promise<ReferralInvite[]> {
    return this.inviteRepository.find({
      where: { email },
      relations: ["referralCode", "referralCode.user"],
      order: { createdAt: "DESC" },
    })
  }

  async findPendingInvites(): Promise<ReferralInvite[]> {
    return this.inviteRepository.find({
      where: { status: InviteStatus.PENDING },
      relations: ["referralCode"],
    })
  }

  async expireOldInvites(): Promise<void> {
    await this.inviteRepository
      .createQueryBuilder()
      .update(ReferralInvite)
      .set({ status: InviteStatus.EXPIRED })
      .where("status = :status", { status: InviteStatus.PENDING })
      .andWhere("expiresAt < :now", { now: new Date() })
      .execute()
  }
}
