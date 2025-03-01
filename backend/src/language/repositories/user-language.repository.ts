import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { UserLanguagePreference } from "../entities/user-language-preference.entity"

@Injectable()
export class UserLanguageRepository {
  constructor(
    @InjectRepository(UserLanguagePreference)
    private userLanguageRepository: Repository<UserLanguagePreference>,
  ) {}

  async findAll(): Promise<UserLanguagePreference[]> {
    return this.userLanguageRepository.find({
      relations: ["language"],
    })
  }

  async findById(id: string): Promise<UserLanguagePreference> {
    return this.userLanguageRepository.findOne({
      where: { id },
      relations: ["language"],
    })
  }

  async findByUserId(userId: string): Promise<UserLanguagePreference> {
    return this.userLanguageRepository.findOne({
      where: { userId },
      relations: ["language"],
    })
  }

  async create(preferenceData: Partial<UserLanguagePreference>): Promise<UserLanguagePreference> {
    const preference = this.userLanguageRepository.create(preferenceData)
    return this.userLanguageRepository.save(preference)
  }

  async update(id: string, preferenceData: Partial<UserLanguagePreference>): Promise<UserLanguagePreference> {
    await this.userLanguageRepository.update(id, preferenceData)
    return this.findById(id)
  }

  async updateByUserId(
    userId: string,
    preferenceData: Partial<UserLanguagePreference>,
  ): Promise<UserLanguagePreference> {
    const preference = await this.findByUserId(userId)
    if (preference) {
      await this.userLanguageRepository.update(preference.id, preferenceData)
      return this.findById(preference.id)
    }
    return null
  }

  async upsert(userId: string, preferenceData: Partial<UserLanguagePreference>): Promise<UserLanguagePreference> {
    const preference = await this.findByUserId(userId)
    if (preference) {
      await this.userLanguageRepository.update(preference.id, preferenceData)
      return this.findById(preference.id)
    } else {
      const newPreference = this.userLanguageRepository.create({
        userId,
        ...preferenceData,
      })
      return this.userLanguageRepository.save(newPreference)
    }
  }

  async remove(id: string): Promise<void> {
    await this.userLanguageRepository.delete(id)
  }

  async removeByUserId(userId: string): Promise<void> {
    const preference = await this.findByUserId(userId)
    if (preference) {
      await this.userLanguageRepository.delete(preference.id)
    }
  }
}

