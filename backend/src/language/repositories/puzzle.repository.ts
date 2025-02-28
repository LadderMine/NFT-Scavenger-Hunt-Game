import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Puzzle } from "../entities/puzzle.entity"

@Injectable()
export class PuzzleRepository {
  constructor(
    @InjectRepository(Puzzle)
    private puzzleRepository: Repository<Puzzle>,
  ) {}

  async findAll(): Promise<Puzzle[]> {
    return this.puzzleRepository.find({
      where: { isActive: true },
      order: { createdAt: "DESC" },
    })
  }

  async findById(id: string): Promise<Puzzle> {
    return this.puzzleRepository.findOne({
      where: { id },
      relations: ["translations", "translations.language"],
    })
  }

  async findByIdentifier(identifier: string): Promise<Puzzle> {
    return this.puzzleRepository.findOne({
      where: { identifier },
      relations: ["translations", "translations.language"],
    })
  }

  async findByType(type: string): Promise<Puzzle[]> {
    return this.puzzleRepository.find({
      where: { type, isActive: true },
      order: { createdAt: "DESC" },
    })
  }

  async create(puzzleData: Partial<Puzzle>): Promise<Puzzle> {
    const puzzle = this.puzzleRepository.create(puzzleData)
    return this.puzzleRepository.save(puzzle)
  }

  async update(id: string, puzzleData: Partial<Puzzle>): Promise<Puzzle> {
    await this.puzzleRepository.update(id, puzzleData)
    return this.findById(id)
  }

  async remove(id: string): Promise<void> {
    await this.puzzleRepository.delete(id)
  }

  async softDelete(id: string): Promise<Puzzle> {
    await this.puzzleRepository.update(id, { isActive: false })
    return this.findById(id)
  }
}

