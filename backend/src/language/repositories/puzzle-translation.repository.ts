import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { PuzzleTranslation } from "../entities/puzzle-translation.entity"

@Injectable()
export class PuzzleTranslationRepository {
  constructor(
    @InjectRepository(PuzzleTranslation)
    private puzzleTranslationRepository: Repository<PuzzleTranslation>,
  ) {}

  async findAll(): Promise<PuzzleTranslation[]> {
    return this.puzzleTranslationRepository.find({
      relations: ["puzzle", "language"],
    })
  }

  async findById(id: string): Promise<PuzzleTranslation> {
    return this.puzzleTranslationRepository.findOne({
      where: { id },
      relations: ["puzzle", "language"],
    })
  }

  async findByPuzzleAndLanguage(puzzleId: string, languageId: string): Promise<PuzzleTranslation> {
    return this.puzzleTranslationRepository.findOne({
      where: { puzzleId, languageId },
      relations: ["puzzle", "language"],
    })
  }

  async findByPuzzle(puzzleId: string): Promise<PuzzleTranslation[]> {
    return this.puzzleTranslationRepository.find({
      where: { puzzleId },
      relations: ["language"],
    })
  }

  async findByLanguage(languageId: string): Promise<PuzzleTranslation[]> {
    return this.puzzleTranslationRepository.find({
      where: { languageId },
      relations: ["puzzle"],
    })
  }

  async create(translationData: Partial<PuzzleTranslation>): Promise<PuzzleTranslation> {
    const translation = this.puzzleTranslationRepository.create(translationData)
    return this.puzzleTranslationRepository.save(translation)
  }

  async update(id: string, translationData: Partial<PuzzleTranslation>): Promise<PuzzleTranslation> {
    await this.puzzleTranslationRepository.update(id, translationData)
    return this.findById(id)
  }

  async upsert(
    puzzleId: string,
    languageId: string,
    translationData: Partial<PuzzleTranslation>,
  ): Promise<PuzzleTranslation> {
    const existing = await this.findByPuzzleAndLanguage(puzzleId, languageId)
    if (existing) {
      await this.puzzleTranslationRepository.update(existing.id, translationData)
      return this.findById(existing.id)
    } else {
      const newTranslation = this.puzzleTranslationRepository.create({
        puzzleId,
        languageId,
        ...translationData,
      })
      return this.puzzleTranslationRepository.save(newTranslation)
    }
  }

  async remove(id: string): Promise<void> {
    await this.puzzleTranslationRepository.delete(id)
  }

  async approve(id: string, approvedBy: string): Promise<PuzzleTranslation> {
    await this.puzzleTranslationRepository.update(id, {
      isApproved: true,
      approvedBy,
      approvedAt: new Date(),
    })
    return this.findById(id)
  }
}

