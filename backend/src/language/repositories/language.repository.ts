import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Language } from "../entities/language.entity"

@Injectable()
export class LanguageRepository {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) {}

  async findAll(): Promise<Language[]> {
    return this.languageRepository.find({ where: { isActive: true }, order: { sortOrder: "ASC" } })
  }

  async findById(id: string): Promise<Language> {
    return this.languageRepository.findOne({ where: { id } })
  }

  async findByCode(code: string): Promise<Language> {
    return this.languageRepository.findOne({ where: { code } })
  }

  async findDefault(): Promise<Language> {
    return this.languageRepository.findOne({ where: { isDefault: true } })
  }

  async create(languageData: Partial<Language>): Promise<Language> {
    const language = this.languageRepository.create(languageData)
    return this.languageRepository.save(language)
  }

  async update(id: string, languageData: Partial<Language>): Promise<Language> {
    await this.languageRepository.update(id, languageData)
    return this.findById(id)
  }

  async remove(id: string): Promise<void> {
    await this.languageRepository.delete(id)
  }

  async setDefault(id: string): Promise<Language> {
    // First, set all languages to non-default
    await this.languageRepository.update({}, { isDefault: false })

    // Then set the specified language as default
    await this.languageRepository.update(id, { isDefault: true })

    return this.findById(id)
  }
}

