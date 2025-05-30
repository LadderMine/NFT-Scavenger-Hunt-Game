import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Level } from './entities/level.entity';
import { LevelEnum } from 'src/enums/LevelEnum';

@Injectable()
export class LevelService {

  //provide repositry injection of level entity
  constructor(
    @InjectRepository(Level) 
    private readonly levelRepository: Repository<Level>
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

  /**
   * Increment the total puzzle count for a given level enum.
   * If the level record does not yet exist, create it with count = 1.
   */
  async incrementCount(level: LevelEnum): Promise<void> {
    let levelRecord = await this.levelRepository.findOne({ where: { level } });

    if (!levelRecord) {
      levelRecord = this.levelRepository.create({ level, count: 1, name: level, description: '' });
    } else {
      levelRecord.count += 1;
    }

    await this.levelRepository.save(levelRecord);
  }

  /**
   * Decrement the puzzle count for a given level enum, without going below zero.
   */
  async decrementCount(level: LevelEnum): Promise<void> {
    const levelRecord = await this.levelRepository.findOne({ where: { level } });

    if (levelRecord) {
      levelRecord.count = Math.max(0, levelRecord.count - 1);
      await this.levelRepository.save(levelRecord);
    }
  }
}