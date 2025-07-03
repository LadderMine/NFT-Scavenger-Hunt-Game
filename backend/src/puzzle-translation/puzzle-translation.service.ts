import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PuzzleTranslation } from './entities/puzzle-translation.entity';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';

@Injectable()
export class PuzzleTranslationService {
  constructor(
    @InjectRepository(PuzzleTranslation)
    private readonly translationRepo: Repository<PuzzleTranslation>,
  ) {}

  async create(dto: CreateTranslationDto) {
    const translation = this.translationRepo.create({
      ...dto,
      puzzle: { id: dto.puzzleId } as any,
    });
    return this.translationRepo.save(translation);
  }

  async update(id: number, dto: UpdateTranslationDto) {
    const existing = await this.translationRepo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Translation not found');
    Object.assign(existing, dto);
    return this.translationRepo.save(existing);
  }

  async findByPuzzleAndLanguage(puzzleId: string, language: string) {
    const translation = await this.translationRepo.findOne({
      where: { puzzle: { id: puzzleId }, language },
      relations: ['puzzle'],
    });
    if (!translation) throw new NotFoundException('Translation not found for given language');
    return translation;
  }

  async findAll(puzzleId: string) {
    return this.translationRepo.find({ where: { puzzle: { id: puzzleId } } });
  }
} 