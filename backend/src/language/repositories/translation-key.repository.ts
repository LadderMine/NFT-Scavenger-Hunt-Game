import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { TranslationKey } from "../entities/translation-key.entity"

@Injectable()
export class TranslationKeyRepository {
  constructor(
    @InjectRepository(TranslationKey)
    private translationKeyRepository: Repository<TranslationKey>,
  ) {}

  async findAll(): Promise<TranslationKey[]> {
    return this.translationKeyRepository.find({ order: { category: "ASC", key: "ASC" } })
  }

  async findById(id: string): Promise<TranslationKey> {
    return this.translationKeyRepository.findOne({ where: { id } })
  }

  async findByKey(key: string): Promise<TranslationKey> {
    return this.translationKeyRepository.findOne({ where: { key } })
  }

  async findByCategory(category: string): Promise<TranslationKey[]> {
    return this.translationKeyRepository.find({
      where: { category },
      order: { key: "ASC" },
    })
  }

  async create(keyData: Partial<TranslationKey>): Promise<TranslationKey> {
    const key = this.translationKeyRepository.create(keyData)
    return this.translationKeyRepository.save(key)
  }

  async update(id: string, keyData: Partial<TranslationKey>): Promise<TranslationKey> {
    await this.translationKeyRepository.update(id, keyData)
    return this.findById(id)
  }

  async remove(id: string): Promise<void> {
    await this.translationKeyRepository.delete(id)
  }

  async findOrCreate(keyData: Partial<TranslationKey>): Promise<TranslationKey> {
    const existingKey = await this.findByKey(keyData.key)
    if (existingKey) {
      return existingKey
    }
    return this.create(keyData)
  }

  async bulkCreate(keys: Partial<TranslationKey>[]): Promise<TranslationKey[]> {
    const createdKeys = this.translationKeyRepository.create(keys)
    return this.translationKeyRepository.save(createdKeys)
  }
}

