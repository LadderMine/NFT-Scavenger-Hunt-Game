import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DraftPuzzle } from './entities/draft-puzzle.entity';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UpdateDraftDto } from './dto/update-draft.dto';

@Injectable()
export class DraftPuzzleService {
  constructor(
    @InjectRepository(DraftPuzzle)
    private readonly draftRepo: Repository<DraftPuzzle>,
  ) {}

  create(createDto: CreateDraftDto, userId: string) {
    const draft = this.draftRepo.create({ ...createDto, createdBy: userId });
    return this.draftRepo.save(draft);
  }

  findAll() {
    return this.draftRepo.find();
  }

  async findOne(id: string) {
    const draft = await this.draftRepo.findOne({ where: { id } });
    if (!draft) throw new NotFoundException('Draft not found');
    return draft;
  }

  async update(id: string, updateDto: UpdateDraftDto) {
    const draft = await this.findOne(id);
    Object.assign(draft, updateDto);
    return this.draftRepo.save(draft);
  }

  async remove(id: string) {
    const draft = await this.findOne(id);
    return this.draftRepo.remove(draft);
  }

  async publish(id: string) {
    const draft = await this.findOne(id);
    // Emit event or return structured data for publishing module to handle
    return {
      event: 'PUZZLE_DRAFT_PUBLISHED',
      data: draft,
    };
  }
}
