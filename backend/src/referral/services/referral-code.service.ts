import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { ReferralCode } from "../entities/referral-code.entity"
import type { CreateReferralCodeDto } from "../dto/create-referral-code.dto"
import { customAlphabet } from "nanoid"

@Injectable()
export class ReferralCodeService {
  private readonly nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8)

  constructor(private readonly referralCodeRepository: Repository<ReferralCode>) {}

  async createReferralCode(userId: string, createDto: CreateReferralCodeDto = {}): Promise<ReferralCode> {
    // Check if user already has an active referral code
    const existingCode = await this.referralCodeRepository.findOne({
      where: { userId, isActive: true },
    })

    if (existingCode) {
      throw new ConflictException("User already has an active referral code")
    }

    let code: string
    let isUnique = false
    let attempts = 0
    const maxAttempts = 10

    // Generate unique code
    while (!isUnique && attempts < maxAttempts) {
      code = this.nanoid()
      const existing = await this.referralCodeRepository.findOne({
        where: { code },
      })
      isUnique = !existing
      attempts++
    }

    if (!isUnique) {
      throw new Error("Failed to generate unique referral code")
    }

    const referralCode = this.referralCodeRepository.create({
      code,
      userId,
      expiresAt: createDto.expiresAt ? new Date(createDto.expiresAt) : null,
      isActive: createDto.isActive ?? true,
    })

    return this.referralCodeRepository.save(referralCode)
  }

  async findByCode(code: string): Promise<ReferralCode> {
    const referralCode = await this.referralCodeRepository.findOne({
      where: { code, isActive: true },
      relations: ["user"],
    })

    if (!referralCode) {
      throw new NotFoundException("Referral code not found or inactive")
    }

    // Check if expired
    if (referralCode.expiresAt && referralCode.expiresAt < new Date()) {
      throw new NotFoundException("Referral code has expired")
    }

    return referralCode
  }

  async findByUserId(userId: string): Promise<ReferralCode[]> {
    return this.referralCodeRepository.find({
      where: { userId },
      relations: ["invites"],
      order: { createdAt: "DESC" },
    })
  }

  async updateStats(
    codeId: string,
    increment: { invites?: number; successful?: number; bonus?: number },
  ): Promise<void> {
    const updateData: any = {}

    if (increment.invites) {
      updateData.totalInvites = () => `totalInvites + ${increment.invites}`
    }

    if (increment.successful) {
      updateData.successfulInvites = () => `successfulInvites + ${increment.successful}`
    }

    if (increment.bonus) {
      updateData.totalBonusEarned = () => `totalBonusEarned + ${increment.bonus}`
    }

    await this.referralCodeRepository.update(codeId, updateData)
  }

  async deactivateCode(codeId: string): Promise<void> {
    await this.referralCodeRepository.update(codeId, { isActive: false })
  }
}
