import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Level } from './entities/level.entity';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
  ) {}

  async create(createLevelDto: CreateLevelDto) {
    const level = this.levelRepository.create(createLevelDto);
    return await this.levelRepository.save(level);
  }

  async findAll() {
    return await this.levelRepository.find({
      relations: ['puzzles'],
    });
  }

  async findOne(id: number) {
    const level = await this.levelRepository.findOne({
      where: { id },
      relations: ['puzzles'],
    });
    
    if (!level) {
      throw new NotFoundException(`Level with ID ${id} not found`);
    }
    
    return level;
  }

  async update(id: number, updateLevelDto: UpdateLevelDto) {
    const level = await this.findOne(id);
    Object.assign(level, updateLevelDto);
    return await this.levelRepository.save(level);
  }

  async remove(id: number) {
    const level = await this.findOne(id);
    return await this.levelRepository.remove(level);
  }
}