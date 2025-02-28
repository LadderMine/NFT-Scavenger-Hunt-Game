import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Translation } from "../entities/translation.entity"

@Injectable()
export class TranslationRepository {
  constructor(
    @InjectRepository(Translation)
    private translationRepository: Repository<Translation>,
  ) {}

  async findAll(): Promise<Translation[]> {
    return this.translationRepository.find({
      relations: ["language", "translationKey"],
    })
  }

  async findById(id: string): Promise<Translation> {
    return this.translationRepository.findOne({
      where: { id },
      relations: ["language", "translationKey"],
    })
  }

  async findByLanguageAndKey(languageId: string, keyId: string): Promise<Translation> {
    return this.translationRepository.findOne({
      where: { languageId, translationKeyId: keyId },
      relations: ["language", "translationKey"],
    })
  }

  async findByLanguage(languageId: string): Promise<Translation[]> {
    return this.translationRepository.find({
      where: { languageId },
      relations: ["translationKey"],
    })
  }

  async findByCategory(languageId: string, category: string): Promise<Translation[]> {
    return this.translationRepository
      .createQueryBuilder("translation")
      .innerJoinAndSelect("translation.translationKey", "key")
      .where("translation.languageId = :languageId", { languageId })
      .andWhere("key.category = :category", { category })
      .getMany()
  }

  async create(translationData: Partial<Translation>): Promise<Translation> {
    const translation = this.translationRepository.create(translationData)
    return this.translationRepository.save(translation)
  }

  async update(id: string, translationData: Partial<Translation>): Promise<Translation> {
    await this.translationRepository.update(id, translationData)
    return this.findById(id)
  }

  async remove(id: string): Promise<void> {
    await this.translationRepository.delete(id)
  }

  async bulkCreate(translations: Partial<Translation>[]): Promise<Translation[]> {
    const createdTranslations = this.translationRepository.create(translations)
    return this.translationRepository.save(createdTranslations)
  }

  async bulkUpdate(translations: Partial<Translation>[]): Promise<void> {
    await Promise.all(
      translations.map(async (translation) => {
        if (translation.id) {
          await this.translationRepository.update(translation.id, translation)
        }
      }),
    )
  }
}

